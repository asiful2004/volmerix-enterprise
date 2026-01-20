<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get reviews for a specific product from JSON file
    $product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : null;

    if (!$product_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        exit();
    }

    $reviewsFile = __DIR__ . '/../data/reviews.json';
    $reviews = [];

    if (file_exists($reviewsFile)) {
        $existingData = file_get_contents($reviewsFile);
        $allReviews = json_decode($existingData, true) ?: [];

        // Filter reviews for this product
        $reviews = array_filter($allReviews, function($review) use ($product_id) {
            return $review['product_id'] == $product_id;
        });

        // Sort by newest first
        usort($reviews, function($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });
    }

    echo json_encode(['success' => true, 'reviews' => array_values($reviews)]);

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

    // Prepare review data
    $review = [
        'id' => uniqid('review_', true),
        'product_id' => intval($data['product_id']),
        'product_name' => trim($data['product_name']),
        'name' => trim($data['name']),
        'email' => trim($data['email']),
        'rating' => $rating,
        'review_text' => trim($data['review_text']),
        'timestamp' => $data['timestamp'] ?? date('c'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];

    // Save to JSON file
    $reviewsFile = __DIR__ . '/../data/reviews.json';

    $reviews = [];
    if (file_exists($reviewsFile)) {
        $existingData = file_get_contents($reviewsFile);
        $reviews = json_decode($existingData, true) ?: [];
    }

    $reviews[] = $review;

    // Ensure data directory exists
    $dataDir = dirname($reviewsFile);
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    // Always send Discord webhook first (before saving)
    $discordWebhookUrl = 'https://discord.com/api/webhooks/1462866313788657778/Ga0EqhyKHHwpN81Qs7NWEzMySjCjejpTN5v12o_KfUiiMShBaHrMi5vlFPchn7B6Zpuf';

    $discordMessage = [
        'content' => '⭐ **New Product Review**',
        'embeds' => [
            [
                'title' => 'Review Details',
                'fields' => [
                    [
                        'name' => 'Product',
                        'value' => $review['product_name'],
                        'inline' => true
                    ],
                    [
                        'name' => 'Rating',
                        'value' => str_repeat('★', $rating) . str_repeat('☆', 5 - $rating),
                        'inline' => true
                    ],
                    [
                        'name' => 'Customer',
                        'value' => $review['name'] . ' (' . $review['email'] . ')',
                        'inline' => false
                    ],
                    [
                        'name' => 'Review',
                        'value' => strlen($review['review_text']) > 500 ?
                            substr($review['review_text'], 0, 500) . '...' :
                            $review['review_text'],
                        'inline' => false
                    ]
                ],
                'footer' => [
                    'text' => '© 2024-2026 Volmerix Enterprise'
                ]
            ]
        ],
        'username' => 'Volmerix Review Bot',
        'avatar_url' => 'https://i.imgur.com/placeholder.png'
    ];

    // Send to Discord with error checking
    $webhookSuccess = false;
    $ch = curl_init($discordWebhookUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordMessage));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($httpCode === 204) {
        $webhookSuccess = true;
    } else {
        error_log("Review webhook failed: HTTP $httpCode, Error: $error");
    }

    // Save to JSON file regardless of webhook success
    if (file_put_contents($reviewsFile, json_encode($reviews, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'message' => 'Review submitted successfully',
            'review_id' => $review['id'],
            'webhook_sent' => $webhookSuccess
        ]);
    } else {
        // Even if file save fails, return success since webhook was attempted
        echo json_encode([
            'success' => true,
            'message' => 'Review submitted (webhook sent)',
            'review_id' => $review['id'],
            'webhook_sent' => $webhookSuccess,
            'file_save_error' => true
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
