<?php
// Marketing Campaign HTML Mailer Endpoint for Ystore CMS
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
  exit;
}

$cleanHeader = function ($str) {
  return trim(str_replace(["\r", "\n"], '', (string)$str));
};

$recipients = $data['recipients'] ?? [];
$subject = $cleanHeader($data['subject'] ?? 'Yellow Berry Store Update');
$htmlBody = trim((string)($data['htmlBody'] ?? ''));
$plainBody = trim((string)($data['body'] ?? ''));
$fromName = $cleanHeader($data['fromName'] ?? 'Yellow Berry Store');
$fromEmail = $cleanHeader($data['fromEmail'] ?? 'noreply@ystoreza.co.za');
$replyToEmail = $cleanHeader($data['replyToEmail'] ?? 'info@yberry.co.za');

if (!is_array($recipients) || count($recipients) === 0 || $subject === '' || ($htmlBody === '' && $plainBody === '')) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Recipients, subject, and email content are required']);
  exit;
}

if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
  $fromEmail = 'noreply@ystoreza.co.za';
}
if (!filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
  $replyToEmail = $fromEmail;
}

$validEmails = [];
foreach ($recipients as $email) {
  $clean = $cleanHeader($email);
  if (filter_var($clean, FILTER_VALIDATE_EMAIL)) {
    $validEmails[strtolower($clean)] = $clean;
  }
}

if (count($validEmails) === 0) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'No valid recipient email addresses provided']);
  exit;
}

$isHtml = $htmlBody !== '';
$messageBody = $isHtml
  ? $htmlBody
  : ($plainBody . "\n\n---\nYellow Berry Store • https://ystoreza.co.za/\nReply to {$replyToEmail} to unsubscribe at any time.\n");

$headers = [
  'MIME-Version: 1.0',
  $isHtml ? 'Content-Type: text/html; charset=UTF-8' : 'Content-Type: text/plain; charset=UTF-8',
  "From: {$fromName} <{$fromEmail}>",
  "Reply-To: {$replyToEmail}",
  'X-Mailer: Ystore-Template-Builder/2.0'
];

$sentCount = 0;
$failedCount = 0;
foreach (array_values($validEmails) as $to) {
  if (@mail($to, $subject, $messageBody, implode("\r\n", $headers))) {
    $sentCount++;
  } else {
    $failedCount++;
  }
}

if ($sentCount === 0) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Server mail() could not deliver campaign emails.']);
  exit;
}

echo json_encode([
  'ok' => true,
  'sentCount' => $sentCount,
  'failedCount' => $failedCount,
  'message' => "Dispatched HTML template to {$sentCount} recipient(s)."
]);
