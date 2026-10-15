// Печатает lead-config.php из переменных окружения (секреты GitHub Actions) для public/api/lead.php.
// На тестовом поддомене (STAGING=1) заявки помечаются «ТЕСТ».
const list = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);
const php = (v) => `'${String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
const arr = (a) => `[${a.map(php).join(", ")}]`;
const cfg = {
  tg_token: process.env.TG_TOKEN || "",
  tg_chats: list(process.env.TG_CHATS),
  mail_to: list(process.env.MAIL_TO),
  staging: process.env.STAGING === "1",
};
process.stdout.write(`<?php\nreturn ['tg_token' => ${php(cfg.tg_token)}, 'tg_chats' => ${arr(cfg.tg_chats)}, 'mail_to' => ${arr(cfg.mail_to)}, 'staging' => ${cfg.staging ? "true" : "false"}];\n`);
