# Поручение

**Сервис для размещения заказов на мелкие услуги** — прототип на Bootstrap 5.3.8. Курсовой проект команды ПИУКИС-23.

**Демо:** [moratakki.github.io/Poruchenie](https://moratakki.github.io/Poruchenie/)  
**Репозиторий:** [github.com/Moratakki/Poruchenie](https://github.com/Moratakki/Poruchenie)

## Страницы

- `index.html` — главная и презентация стартапа: категории, сценарии, калькулятор, свежие заказы, рынок, команда, FAQ.
- `orders.html` — лента заказов с фильтрами, создание заказа в модальном окне, карточка заказа и отклик исполнителя.

## Стек

- HTML5 + CSS3;
- **Bootstrap 5.3.8**;
- Bootstrap Icons 1.13.2;
- **чистый JavaScript**;
- localStorage для демо-данных.

## Структура

```text
Poruchenie/
├── index.html
├── orders.html
├── 404.html
├── assets/
│   ├── css/custom.css
│   ├── js/data.js, app.js
│   ├── img/
│   └── vendor/       # Bootstrap 5.3.8, Bootstrap Icons
├── README.md
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

## Команда

| Участник | Роль |
|---|---|
| Быков Данил Игоревич | Тимлид: продукт, архитектура, JavaScript, ТЗ |
| Довгань Данил Игоревич | Front-end: Bootstrap-вёрстка, адаптивность, интерфейсы |
| Рассамаха Кирилл Сергеевич | Контент-менеджер: данные, тексты, документация |

Это учебный прототип: платежи имитируются, данные хранятся только в браузере.
