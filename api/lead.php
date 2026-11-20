<?php
// Приём заявок санаториикмв.рф. Хранит в $HOME/sanatorii-leads/leads.jsonl (вне веб-папки).
// Заявки НЕ уходят в общую CRM до запуска продукта.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
if (!empty($_POST['website'])) { echo '{"ok":true}'; exit; } // ловушка для ботов
$dir = dirname(__DIR__, 3) . '/sanatorii-leads';
if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
$fields = ['product_id','tour_name','format','source','submission_id','name','phone','adults','children','comment','privacy_consent','page_url','first_landing_page','yclid','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
$lead = [];
foreach ($fields as $k) { if (isset($_POST[$k])) { $lead[$k] = mb_substr(trim((string)$_POST[$k]), 0, 3000); } }
$digits = preg_replace('/\D/', '', $lead['phone'] ?? '');
if (strlen($digits) !== 11 || empty($lead['name']) || ($lead['privacy_consent'] ?? '') !== 'yes') { http_response_code(400); echo '{"ok":false,"error":"invalid"}'; exit; }
$lead['id'] = date('ymd-His') . '-' . bin2hex(random_bytes(2));
$lead['created_at'] = date('c');
$lead['ip'] = $_SERVER['REMOTE_ADDR'] ?? '';
$lead['ua'] = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 300);
$fp = fopen("$dir/leads.jsonl", 'a');
if (!$fp) { http_response_code(500); echo '{"ok":false,"error":"store"}'; exit; }
flock($fp, LOCK_EX); fwrite($fp, json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n"); flock($fp, LOCK_UN); fclose($fp);
@chmod("$dir/leads.jsonl", 0600);
echo json_encode(['ok' => true, 'id' => $lead['id']]);
