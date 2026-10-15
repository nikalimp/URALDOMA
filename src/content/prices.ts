// Цены вне тарифов (02-spec §5). Рыночные ориентиры по решению Ника 2026-10-15 — клиент подтверждает до запуска (бриф в. 7).
export const designPrice = { rate: 3000, term: "6⁠–⁠10 недель" };

export const priceRows: { service: string; value: string; note: string; href: string }[] = [
  { service: "Ремонт квартиры под ключ", value: "20 000 — 40 000 ₽/м²", note: "три тарифа, цена работ", href: "/services/turnkey-renovation/" },
  { service: "Дизайн-проект интерьера", value: "от 3 000 ₽/м²", note: "6⁠–⁠10 недель", href: "/services/interior-design/" },
  { service: "Дизайнерский ремонт", value: "от 30 000 ₽/м²", note: "ремонт по проекту с авторским надзором", href: "/services/designer-renovation/" },
  { service: "Ремонт ванной и санузла", value: "от 180 000 ₽", note: "санузел до 5 м², работы", href: "/services/bathroom-renovation/" },
  { service: "Ремонт кухни", value: "по тарифу за м²", note: "кухонный гарнитур — отдельно", href: "/services/kitchen-renovation/" },
  { service: "Перепланировка", value: "после осмотра", note: "проект и согласование", href: "/services/redevelopment/" },
  { service: "Мебель на заказ", value: "по проекту", note: "производство «Мебель-Урал»", href: "/furniture/" },
];
