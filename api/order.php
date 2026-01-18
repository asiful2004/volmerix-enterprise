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

// Get JSON input (Discord webhook data)
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit();
}

// Validate required fields for Discord webhook
if (empty($data['content']) || !isset($data['username'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid webhook data format']);
    exit();
}

// Send to Discord webhook
$discordWebhookUrl = 'https://discord.com/api/webhooks/1462099978171322522/d2eBv4ibb9OszUtSkCRZ4kCm4540f3knvG9yvdHjKeUc4OfzHItSflFHFDpn1lQQKI3d';

// Add additional order tracking info
$orderData = $data;
$orderData['timestamp'] = date('c');
$orderData['ip'] = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$orderData['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

// Send to Discord
$ch = curl_init($discordWebhookUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
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
