<?php
// Обработчик заявок URALDOMA (02-spec §7): запись на сервер в РФ → Telegram (2 получателя) + почта.
// Настройки — в lead-config.php уровнем выше папки сайта (не публикуется, пишет GitHub Actions из секретов):
//   <?php return ['tg_token' => '...', 'tg_chats' => ['id1', 'id2'], 'mail_to' => ['a@b.ru'], 'mail_from' => 'site@uraldoma.ru'];
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function done(int $code, array $body): void { http_response_code($code); echo json_encode($body, JSON_UNESCAPED_UNICODE); exit; }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') done(405, ['ok' => false]);

// Только со своего сайта
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin && parse_url($origin, PHP_URL_HOST) !== $host) done(403, ['ok' => false]);

// Ловушка для ботов: поле website заполняют только они
if (!empty($_POST['website'])) done(200, ['ok' => true]);

$clean = fn(string $k, int $max = 300): string => trim(mb_substr(strip_tags((string)($_POST[$k] ?? '')), 0, $max));
$phone = $clean('phone', 40);
$digits = preg_replace('/\D+/', '', $phone);
if (strlen($digits) < 10 || strlen($digits) > 15) done(422, ['ok' => false, 'error' => 'phone']);
if (empty($_POST['consent'])) done(422, ['ok' => false, 'error' => 'consent']);

$lead = [
  'date'   => date('Y-m-d H:i:s'),
  'name'   => $clean('name', 100),
  'phone'  => $phone,
  'source' => $clean('source', 60),
  'page'   => $clean('page', 200),
  'extra'  => $clean('extra', 500),
  'ip'     => $_SERVER['REMOTE_ADDR'] ?? '',
];

// Простое ограничение частоты: не больше 5 заявок с одного IP за 10 минут
$root = dirname(__DIR__, 2);
$dir = $root . '/leads';
if (!is_dir($dir)) @mkdir($dir, 0750, true);
$rate = $dir . '/.rate-' . md5($lead['ip']);
$hits = array_filter(explode("\n", (string)@file_get_contents($rate)), fn($t) => $t !== '' && (int)$t > time() - 600);
if (count($hits) >= 5) done(429, ['ok' => false]);
$hits[] = (string)time();
@file_put_contents($rate, implode("\n", $hits));

// 1. Запись на сервер в РФ (152-ФЗ, локализация) — до отправки во внешние сервисы
$fh = @fopen($dir . '/leads-' . date('Y-m') . '.csv', 'a');
if ($fh) { fputcsv($fh, array_values($lead), ';'); fclose($fh); }

$cfgFile = $root . '/lead-config.php';
$cfg = is_file($cfgFile) ? (array)require $cfgFile : [];

$text = (!empty($cfg['staging']) ? "ТЕСТ · " : '') . "Заявка с сайта " . $host . "\n"
  . ($lead['name'] ? "Имя: {$lead['name']}\n" : '')
  . "Телефон: {$lead['phone']}\n"
  . "Форма: {$lead['source']}\nСтраница: {$lead['page']}\n"
  . ($lead['extra'] ? "{$lead['extra']}\n" : '');

$sent = false;

// 2. Telegram
if (!empty($cfg['tg_token']) && !empty($cfg['tg_chats'])) {
  foreach ((array)$cfg['tg_chats'] as $chat) {
    $ctx = stream_context_create(['http' => [
      'method' => 'POST', 'timeout' => 8,
      'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
      'content' => http_build_query(['chat_id' => $chat, 'text' => $text, 'disable_web_page_preview' => 'true']),
    ]]);
    $res = @file_get_contents("https://api.telegram.org/bot{$cfg['tg_token']}/sendMessage", false, $ctx);
    if ($res && str_contains($res, '"ok":true')) $sent = true;
  }
}

// 3. Почта
if (!empty($cfg['mail_to'])) {
  $from = $cfg['mail_from'] ?? ('site@' . preg_replace('/^www\./', '', $host));
  $headers = "From: URALDOMA <{$from}>\r\nContent-Type: text/plain; charset=utf-8\r\n";
  $subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта: ' . $lead['source']) . '?=';
  foreach ((array)$cfg['mail_to'] as $to) { if (@mail($to, $subject, $text, $headers)) $sent = true; }
}

// Заявка уже сохранена на сервере, поэтому отвечаем успехом даже при сбое отправки; сбой видно в логе
if (!$sent) @file_put_contents($dir . '/errors.log', date('c') . " не отправлено: {$lead['phone']}\n", FILE_APPEND);
done(200, ['ok' => true]);
