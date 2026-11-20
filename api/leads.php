<?php
// Выдача заявок боту. Доступ только по ключу из $HOME/sanatorii-leads/key.txt.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$dir = dirname(__DIR__, 3) . '/sanatorii-leads';
$key = @trim(file_get_contents("$dir/key.txt"));
$given = $_SERVER['HTTP_X_LEADS_KEY'] ?? '';
if (!$key || strlen($key) < 24 || !hash_equals($key, $given)) { http_response_code(403); echo '{"ok":false}'; exit; }
$lines = @file("$dir/leads.jsonl", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
$out = array_map(fn($l) => json_decode($l, true), array_slice($lines, -500));
echo json_encode(['ok' => true, 'leads' => array_values(array_filter($out))], JSON_UNESCAPED_UNICODE);
