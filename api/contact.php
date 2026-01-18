<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and message are required']);
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// Prepare contact data
$contact = [
    'id' => uniqid('contact_', true),
    'name' => trim($data['name']),
    'email' => trim($data['email']),
    'message' => trim($data['message']),
    'timestamp' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// Save to JSON file
$contactsFile = __DIR__ . '/../data/contacts.json';

$contacts = [];
if (file_exists($contactsFile)) {
    $existingData = file_get_contents($contactsFile);
    $contacts = json_decode($existingData, true) ?: [];
}

$contacts[] = $contact;

// Ensure data directory exists
$dataDir = dirname($contactsFile);
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

if (file_put_contents($contactsFile, json_encode($contacts, JSON_PRETTY_PRINT))) {
    // Send Discord webhook
    $discordWebhookUrl = 'https://discord.com/api/webhooks/1462099780585914368/tpa-afYCxA3pN6_ooKCttcYCMp6JquygXOIQmJP98jPBdf7JwSVxHgP8dBLCz3L_l4BW';

    $discordMessage = [
        'content' => '📧 **New Contact Form Submission**',
        'embeds' => [
            [
                'title' => 'Contact Details',
                'color' => 15158332, // Red color
                'fields' => [
                    [
                        'name' => 'Name',
                        'value' => $contact['name'],
                        'inline' => true
                    ],
                    [
                        'name' => 'Email',
                        'value' => $contact['email'],
                        'inline' => true
                    ],
                    [
                        'name' => 'Message',
                        'value' => $contact['message'],
                        'inline' => false
                    ],
                    [
                        'name' => 'Time',
                        'value' => date('Y-m-d H:i:s', strtotime($contact['timestamp'])),
                        'inline' => true
                    ]
                ],
                'footer' => [
                    'text' => 'Volmerix Enterprise Contact Form'
                ]
            ]
        ],
        'username' => 'Volmerix Contact Bot',
        'avatar_url' => 'https://i.imgur.com/placeholder.png'
    ];

    // Send to Discord
    $ch = curl_init($discordWebhookUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($discordMessage));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 204) {
        echo json_encode(['success' => true, 'message' => 'Contact form submitted successfully']);
    } else {
        // Still return success even if Discord fails, since we saved the data
        echo json_encode(['success' => true, 'message' => 'Contact form submitted successfully', 'discord_error' => 'Failed to send Discord notification']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save contact data']);
}
?>
