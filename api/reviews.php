<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$user = 'web';
$password = 'root';
$dbname = 'web';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create database connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Create reviews table if it doesn't exist
$createTableQuery = "
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!$conn->query($createTableQuery)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create table: ' . $conn->error]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get reviews for a specific product
    $product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : null;

    if (!$product_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        exit();
    }

    $stmt = $conn->prepare("SELECT id, product_id, product_name, name, email, rating, review_text, timestamp FROM reviews WHERE product_id = ? ORDER BY timestamp DESC");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    echo json_encode(['success' => true, 'reviews' => $reviews]);
    $stmt->close();

} elseif ($method === 'POST') {
    // Add new review
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit();
    }

    // Validate required fields
    if (empty($data['product_id']) || empty($data['name']) || empty($data['email']) ||
        !isset($data['rating']) || empty($data['review_text'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }

    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        exit();
    }

    // Validate rating
    $rating = intval($data['rating']);
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5']);
        exit();
    }

    // Insert review into database
    $stmt = $conn->prepare("INSERT INTO reviews (product_id, product_name, name, email, rating, review_text, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssisss",
        $data['product_id'],
        $data['product_name'],
        $data['name'],
        $data['email'],
        $rating,
        $data['review_text'],
        $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    );

    if ($stmt->execute()) {
        $review_id = $conn->insert_id;

        // Send Discord notification
        $discordWebhookUrl = 'https://discord.com/api/webhooks/1462099978171322522/d2eBv4ibb9OszUtSkCRZ4kCm4540f3knvG9yvdHjKeUc4OfzHItSflFHFDpn1lQQKI3d';

        $discordMessage = [
            'content' => '⭐ **New Product Review Submitted!**',
            'embeds' => [
                [
                    'title' => 'Review Details',
                    'color' => 16776960, // Yellow color
                    'fields' => [
                        [
                            'name' => 'Product',
                            'value' => $data['product_name'],
                            'inline' => true
                        ],
                        [
                            'name' => 'Rating',
                            'value' => str_repeat('★', $rating) . str_repeat('☆', 5 - $rating),
                            'inline' => true
                        ],
                        [
                            'name' => 'Customer',
                            'value' => $data['name'] . ' (' . $data['email'] . ')',
                            'inline' => false
                        ],
                        [
                            'name' => 'Review',
                            'value' => substr($data['review_text'], 0, 500) . (strlen($data['review_text']) > 500 ? '...' : ''),
                            'inline' => false
                        ]
                    ],
                    'footer' => [
                        'text' => 'Volmerix Enterprise Review System'
                    ],
                    'timestamp' => date('c')
                ]
            ],
            'username' => 'Volmerix Review Bot',
            'avatar_url' => 'https://i.imgur.com/placeholder.png'
        ];

        // Send to Discord (optional)
        $ch = curl_init($discordWebhookUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordMessage));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_exec($ch);
        curl_close($ch);

        echo json_encode([
            'success' => true,
            'message' => 'Review submitted successfully',
            'review_id' => $review_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save review: ' . $stmt->error]);
    }

    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close();
?>
