<?php
// Simple placeholder image generator for Volmerix Enterprise
header('Content-Type: image/png');

// Get parameters
$width = isset($_GET['w']) ? intval($_GET['w']) : 400;
$height = isset($_GET['h']) ? intval($_GET['h']) : 300;
$text = isset($_GET['text']) ? $_GET['text'] : 'Product Image';

// Create image
$image = imagecreatetruecolor($width, $height);

// Colors
$bgColor = imagecolorallocate($image, 240, 240, 240);
$textColor = imagecolorallocate($image, 100, 100, 100);
$borderColor = imagecolorallocate($image, 200, 200, 200);

// Fill background
imagefill($image, 0, 0, $bgColor);

// Draw border
imagerectangle($image, 0, 0, $width-1, $height-1, $borderColor);

// Add text
$fontSize = 5;
$textWidth = imagefontwidth($fontSize) * strlen($text);
$textHeight = imagefontheight($fontSize);
$textX = ($width - $textWidth) / 2;
$textY = ($height - $textHeight) / 2;

// Add multiple lines if text is long
$words = explode(' ', $text);
$lines = [];
$currentLine = '';
foreach ($words as $word) {
    $testLine = $currentLine . ($currentLine ? ' ' : '') . $word;
    if (imagefontwidth($fontSize) * strlen($testLine) > $width - 20) {
        $lines[] = $currentLine;
        $currentLine = $word;
    } else {
        $currentLine = $testLine;
    }
}
$lines[] = $currentLine;

// Draw text lines
$y = $textY - (count($lines) - 1) * $textHeight / 2;
foreach ($lines as $line) {
    $lineWidth = imagefontwidth($fontSize) * strlen($line);
    $x = ($width - $lineWidth) / 2;
    imagestring($image, $fontSize, $x, $y, $line, $textColor);
    $y += $textHeight + 2;
}

// Output image
imagepng($image);
imagedestroy($image);
?>
