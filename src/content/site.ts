// Единый источник правды о компании. Факты — из specs/00-brief.md и снятого сайта (specs/source/).
// TODO(клиент) — заменить фактами до запуска: `npm run check` не пропустит TODO.

export type OrgType =
  | "Organization"
  | "LocalBusiness"
  | "ProfessionalService"
  | "HomeAndConstructionBusiness"
  | "Store";

export const site = {
  url: "https://uraldoma.ru",
  name: "URALDOMA",
  legalName: "ИП Грабовских Николай Николаевич",
  orgType: "HomeAndConstructionBusiness" as OrgType,
  title: "Ремонт квартир под ключ в Екатеринбурге — URALDOMA",
  description:
    "Ремонт квартир в Екатеринбурге под ключ с 2016 года: дизайн-проект, ремонт с авторским надзором и мебель. От 20 000 ₽/м², цена в договоре, гарантия 2 года.",
  tagline: "Ремонт квартир в Екатеринбурге под ключ — от дизайн-проекта до мебели, с 2016 года.",
  lang: "ru",
  locale: "ru_RU",
  foundingYear: 2016,
  areaServed: ["Екатеринбург", "Свердловская область"],

  contacts: {
    phone: "+79292628376",
    phoneDisplay: "+7 929 262-83-76",
    email: "remont.ural96@mail.ru",
    telegram: "https://t.me/uraldoma",
    whatsapp: "", // TODO(клиент, бриф в. 19): нужен ли WhatsApp
    address: {
      street: "", // TODO(клиент, бриф в. 3): актуальный адрес офиса
      city: "Екатеринбург",
      region: "Свердловская область",
      postalCode: "",
      country: "RU",
    },
    geo: null as null | { lat: number; lng: number },
    hours: "", // TODO(клиент): часы работы
    openingHours: [] as { days: string[]; opens: string; closes: string }[],
  },

  cta: { label: "Рассчитать стоимость", href: "/prices/#calculator" },

  legal: {
    inn: "720509214462",
    ogrnip: "320723200014329", // ЕГРИП, регистрация 02.03.2020
    privacyEmail: "n.grabovskih@mail.ru",
  },

  sameAs: ["https://t.me/uraldoma"],
  socials: [{ label: "Telegram-канал", href: "https://t.me/uraldoma" }],
  metaNote: "",

  person: {
    name: "Николай Грабовских",
    jobTitle: "Директор URALDOMA",
    description: "Директор URALDOMA. Более 10 лет делает комплексный ремонт квартир в Екатеринбурге под ключ — от дизайн-проекта до обстановки мебелью.",
    sameAs: [] as string[],
  },

  // Фоновое видео первого экрана: файл с текущего сайта (02-spec §7). Пока файла нет — показывается постер.
  // Видео с объекта для первого экрана ждём от клиента: пока src пустой, на первом экране — фото (hero.photo)
  heroVideo: { src: "", poster: "/images/objects/garinsky/02-wide.webp" },

  metrikaId: 112779075, // счётчик «URALDOMA» (решение Ника 22.10.2026); 62022598 со старой Tilda удалён
  darkTheme: true, // переключатель в шапке и футере, по умолчанию — системная тема
};

export const nav = [
  { href: "/services/", label: "Услуги" },
  { href: "/prices/", label: "Цены" },
  { href: "/portfolio/", label: "Портфолио" },
  { href: "/furniture/", label: "Мебель" },
  { href: "/about/", label: "О компании" },
  { href: "/articles/", label: "Статьи" },
];

export const footerNav = [
  { href: "/about/", label: "О компании" },
  { href: "/how-we-work/", label: "Как мы работаем" },
  { href: "/warranty/", label: "Гарантия и договор" },
  { href: "/complexes/", label: "Ремонт в ЖК" },
  { href: "/careers/", label: "Вакансии" },
  { href: "/partners/", label: "Партнёрская программа" },
  { href: "/contacts/", label: "Контакты" },
];
