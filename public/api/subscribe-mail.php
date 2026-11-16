<?php
// Lightweight Newsletter Mailbox Router for cPanel / Apache hosting
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

$subscriberEmail = $cleanHeader($data['email'] ?? '');
$routeToEmail = $cleanHeader($data['routeToEmail'] ?? 'info@yberry.co.za');
$sourcePage = $cleanHeader($data['sourcePage'] ?? 'home');
$fromName = $cleanHeader($data['fromName'] ?? 'Ystore Newsletter');
$fromEmail = $cleanHeader($data['fromEmail'] ?? 'noreply@ystoreza.co.za');
$subjectTemplate = $cleanHeader($data['subjectTemplate'] ?? 'New Newsletter Subscriber: {{email}}');
$isTest = !empty($data['isTest']);

if (!filter_var($subscriberEmail, FILTER_VALIDATE_EMAIL) || !filter_var($routeToEmail, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Valid subscriber and destination emails are required']);
  exit;
}

if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
  $fromEmail = 'noreply@ystoreza.co.za';
}

$subject = str_replace('{{email}}', $subscriberEmail, $subjectTemplate);
if ($isTest) {
  $subject = '[TEST] ' . $subject;
}

$body = ($isTest ? "This is a test subscription email from Ystore CMS.\n\n" : "New newsletter subscriber on Ystore:\n\n")
  . "Subscriber Email: {$subscriberEmail}\n"
  . "Source Page: {$sourcePage}\n"
  . "Routed To: {$routeToEmail}\n"
  . "Timestamp (UTC): " . gmdate('c') . "\n";

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  "From: {$fromName} <{$fromEmail}>",
  "Reply-To: {$subscriberEmail}",
  'X-Mailer: Ystore-Subscription-Router/1.0'
];

$sent = @mail($routeToEmail, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'PHP mail() failed on server. Check cPanel mail / SMTP configuration.']);
  exit;
}

echo json_encode(['ok' => true, 'message' => 'Subscription routed to ' . $routeToEmail]);

