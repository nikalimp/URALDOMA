<?php
// Проверка отправки заявок (без отправки сообщений): доступна только с ключом — первые 12 знаков sha1 токена бота.
// Показывает, читается ли lead-config.php, есть ли curl и allow_url_fopen, отвечает ли Telegram (getMe, getChat)
// и последние строки errors.log. Токен и телефоны не выводятся.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
$root = dirname(__DIR__, 2);
$cfgFile = $root . '/lead-config.php';
$cfg = is_file($cfgFile) ? (array)require $cfgFile : [];
$key = substr(sha1((string)($cfg['tg_token'] ?? '')), 0, 12);
if (empty($cfg['tg_token']) || !hash_equals($key, (string)($_GET['key'] ?? ''))) { http_response_code(404); echo '{}'; exit; }

function get_out(string $url): array {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 6]);
    $body = curl_exec($ch); $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_error($ch); curl_close($ch);
    return [$code, $body === false ? "curl: $err" : (string)$body];
  }
  $body = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 10, 'ignore_errors' => true]]));
  return [0, $body === false ? 'fopen: ' . (error_get_last()['message'] ?? 'нет ответа') : (string)$body];
}
$t = $cfg['tg_token'];
[$c1, $me] = get_out("https://api.telegram.org/bot$t/getMe");
$chats = [];
foreach ((array)($cfg['tg_chats'] ?? []) as $chat) { [$c, $r] = get_out("https://api.telegram.org/bot$t/getChat?chat_id=" . urlencode((string)$chat)); $chats[(string)$chat] = "$c " . mb_substr($r, 0, 160); }
$log = @file($root . '/leads/errors.log') ?: [];
$log = array_map(fn($l) => preg_replace('/\+?\d[\d\s()-]{8,}\d/', '[тел]', trim($l)), array_slice($log, -5));
echo json_encode([
  'php' => PHP_VERSION, 'curl' => function_exists('curl_init'), 'allow_url_fopen' => (bool)ini_get('allow_url_fopen'),
  'mail_function' => function_exists('mail'), 'mail_to' => count((array)($cfg['mail_to'] ?? [])), 'chats' => count((array)($cfg['tg_chats'] ?? [])),
  'getMe' => "$c1 " . preg_replace('/"id":\d+,/', '', mb_substr($me, 0, 200)), 'getChat' => $chats, 'errors_log' => $log,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
