# санаториикмв.рф — посадочная «Подбор санатория КМВ»

Статичный сайт без сборки: `index.html`, `style.css`, `app.js`, `config.js`, `privacy.html`.
Пуникод домена: `xn--80aagxamodkugp.xn--p1ai` (на 19.11.2026 по whois свободен, не куплен).

## До публикации
1. Купить/привязать домен, залить файлы в корень хостинга, включить HTTPS.
2. Создать счётчик Метрики, вписать номер в `config.js` (`metrikaId`). Цели (JS-события):
   `quiz_start`, `quiz_step_2..5`, `lead_sent`, `cta_hero`, `cta_header`, `cta_bottom`.
3. Заполнить реквизиты в подвале `index.html` (`#legal`) и в `privacy.html`.
4. Проверить, что CRM-приёмник принимает `product_id=sanatorii-kmv` — отправить 1 тестовую заявку и найти её в листе «Сделки».

Форма шлёт в CRM: name, phone, adults, children, comment (сводка ответов квиза), utm_*, yclid, page_url, first_landing_page.
