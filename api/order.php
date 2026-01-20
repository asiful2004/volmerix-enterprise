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

// Get JSON input (raw order data)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate required fields for order
if (empty($data['product_name']) || empty($data['full_name']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order data format']);
    exit();
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit();
}

// Prepare order data
$orderData = [
    'id' => uniqid('order_', true),
    'product_id' => $data['product_id'] ?? null,
    'product_name' => trim($data['product_name']),
    'product_price' => $data['product_price'] ?? null,
    'full_name' => trim($data['full_name']),
    'email' => trim($data['email']),
    'contact_method' => $data['contact_method'] ?? 'whatsapp',
    'whatsapp_id' => trim($data['whatsapp_id']),
    'company_name' => trim($data['company_name'] ?? ''),
    'currency' => $data['currency'] ?? 'KRW',
    'timestamp' => $data['timestamp'] ?? date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Send Discord webhook
$discordWebhookUrl = 'https://discord.com/api/webhooks/1462099978171322522/d2eBv4ibb9OszUtSkCRZ4kCm4540f3knvG9yvdHjKeUc4OfzHItSflFHFDpn1lQQKI3d';

    $discordMessage = [
        'content' => '🛒 **New Order Received!**',
        'embeds' => [
            [
                'title' => 'Order Details',
                'fields' => [
                    [
                        'name' => 'Product',
                        'value' => $orderData['product_name'] . ($orderData['product_price'] ? ' (' . $orderData['currency'] . ' ' . number_format($orderData['product_price'], 0) . ')' : ''),
                        'inline' => true
                    ],
                    [
                        'name' => 'Customer',
                        'value' => $orderData['full_name'] . ' (' . $orderData['email'] . ')',
                        'inline' => true
                    ],
                    [
                        'name' => 'Contact',
                        'value' => ucfirst($orderData['contact_method']) . ': ' . $orderData['whatsapp_id'] . ($orderData['company_name'] ? '\nCompany: ' . $orderData['company_name'] : ''),
                        'inline' => false
                    ],
                    [
                        'name' => 'Order Time',
                        'value' => date('Y-m-d H:i:s', strtotime($orderData['timestamp'])),
                        'inline' => true
                    ]
                ],
                'footer' => [
                    'text' => '© 2024-2026 Volmerix Enterprise'
                ]
            ]
        ],
        'username' => 'Volmerix Order Bot',
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
$error = curl_error($ch);
curl_close($ch);

if ($httpCode === 204) {
    echo json_encode(['success' => true, 'message' => 'Order notification sent successfully']);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send Discord notification',
        'details' => $error ?: 'HTTP ' . $httpCode
    ]);
}
?>
