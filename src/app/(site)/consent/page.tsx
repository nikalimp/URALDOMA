import Link from "next/link";
import { site } from "@/content/site";
import { crossBorder, legalUpdated, processors } from "@/content/legal";
import { Container, Section } from "@/components/container";
import { Crumbs } from "@/components/crumbs";
import { pageMeta } from "@/lib/meta";
import { formatDate } from "@/lib/posts";

export const metadata = pageMeta({
  title: "Согласие на обработку персональных данных — URALDOMA",
  description: "Текст согласия на обработку персональных данных, которое посетитель сайта uraldoma.ru даёт при отправке формы: какие данные, цели, срок и как отозвать.",
  path: "/consent/",
});

export default function Consent() {
  const email = site.legal.privacyEmail || site.contacts.email;
  return (
    <Section className="pt-10 md:pt-14">
      <Container>
        <Crumbs items={[{ name: "Главная", path: "/" }, { name: "Согласие на обработку персональных данных" }]} />
        <h1 className="max-w-[18ch] text-[40px] leading-[1.02] font-medium tracking-[-0.035em] md:text-[64px]">Согласие на обработку персональных данных</h1>
        <p className="label-mono mt-6 text-muted-foreground">Редакция от {formatDate(legalUpdated)}</p>
        <div className="prose-site mt-12 md:ml-[calc(41.666%+12px)]">
          <p>Отмечая чекбокс и отправляя форму на сайте {site.url}, я свободно, своей волей и в своём интересе даю согласие {site.legalName} (ИНН {site.legal.inn}, ОГРНИП {site.legal.ogrnip}; далее — Оператор) на обработку моих персональных данных на следующих условиях.</p>
          <h2>Какие данные</h2>
          <p>Имя, номер телефона, а также сведения, которые я сам указываю в форме: данные расчёта стоимости, сведения о площадке (партнёрская программа), сведения из резюме (отклик на вакансию); страница сайта, с которой отправлена форма.</p>
          <h2>Для чего</h2>
          <p>Чтобы Оператор связался со мной, ответил на вопросы, договорился о замере, подготовил смету или рассмотрел мой отклик или заявку на партнёрство.</p>
          <h2>Какие действия</h2>
          <p>Сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача (предоставление, доступ), блокирование, удаление и уничтожение — с использованием средств автоматизации и без них.</p>
          <h2>Кому передаются</h2>
          <p>Лицам, обрабатывающим данные по поручению Оператора: {processors.map((p) => p.name).join(", ")}. Я согласен на трансграничную передачу копии заявки ({crossBorder.data}) через {crossBorder.service} для быстрого ответа сотрудников Оператора.</p>
          <h2>Срок и отзыв</h2>
          <p>Согласие действует до достижения целей обработки, но не дольше 1 года с момента последнего обращения, или до его отзыва. Отозвать согласие можно письмом на {email}; после отзыва Оператор прекращает обработку и уничтожает данные в течение 30 дней, если закон не требует иного.</p>
          <p>Как Оператор обрабатывает и защищает данные, описано в <Link href="/privacy-policy/">Политике обработки персональных данных</Link>.</p>
        </div>
      </Container>
    </Section>
  );
}
