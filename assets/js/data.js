window.PORUCHENIE = (function () {
  "use strict";

  const categories = [
    { id: "repair", name: "Ремонт и сборка", icon: "tools", from: 800, count: 284 },
    { id: "cleaning", name: "Уборка", icon: "brush", from: 1200, count: 196 },
    { id: "delivery", name: "Курьер и доставка", icon: "truck", from: 300, count: 321 },
    { id: "digital", name: "Компьютерная помощь", icon: "laptop", from: 700, count: 145 },
    { id: "study", name: "Репетиторы", icon: "mortarboard", from: 900, count: 118 },
    { id: "pets", name: "Питомцы", icon: "heart", from: 400, count: 86 },
    { id: "beauty", name: "Красота", icon: "scissors", from: 1000, count: 73 },
    { id: "events", name: "Мероприятия", icon: "calendar-event", from: 600, count: 54 }
  ];

  const districts = ["Ворошиловский", "Калининский", "Киевский", "Куйбышевский", "Ленинский", "Пролетарский", "Будённовский", "Червоногвардейский"];

  const orders = [
    { id: "P-1042", category: "repair", title: "Собрать шкаф ПАКС в спальне", desc: "Купили шкаф ИКЕА ПАКС, 4 секции. Нужно собрать, выставить по уровню и закрепить к стене. Инструменты есть.", budget: 1800, district: "Ворошиловский", date: "Сегодня, 18:00", urgency: "today", remote: false, responses: 5, status: "new", createdAt: "2026-11-09T09:12", client: { name: "Анна Смирнова", avatar: "assets/img/avatars/anna.jpg", rating: 4.9, orders: 12, verified: true } },
    { id: "P-1041", category: "cleaning", title: "Помыть окна в двухкомнатной квартире", desc: "Три окна и балконный блок. Нужна аккуратная мойка с двух сторон без разводов.", budget: 2500, district: "Калининский", date: "12 ноября, 10:00", urgency: "soon", remote: false, responses: 3, status: "new", createdAt: "2026-11-09T08:40", client: { name: "Марина Котова", avatar: "assets/img/avatars/olga.jpg", rating: 5.0, orders: 21, verified: true } },
    { id: "P-1040", category: "delivery", title: "Забрать документы и доставить в центр", desc: "Забрать конверт на Университетской и отвезти в бизнес-центр на Артёма до 16:00.", budget: 450, district: "Ворошиловский", date: "Сегодня, 15:30", urgency: "today", remote: false, responses: 8, status: "new", createdAt: "2026-11-09T08:05", client: { name: "Игорь Лебедев", avatar: "assets/img/avatars/ivan.jpg", rating: 4.8, orders: 7, verified: true } },
    { id: "P-1039", category: "digital", title: "Настроить ноутбук после переустановки Windows", desc: "Установить драйверы, офис, браузер и антивирус. Перенести рабочие файлы.", budget: 1200, district: "Удалённо", date: "Сегодня, до 21:00", urgency: "today", remote: true, responses: 7, status: "new", createdAt: "2026-11-09T07:50", client: { name: "Павел Дорохов", avatar: "assets/img/avatars/sergey.jpg", rating: 4.7, orders: 5, verified: false } },
    { id: "P-1038", category: "study", title: "Позаниматься математикой с девятиклассником", desc: "Разобрать геометрию и подготовить к контрольной. Два занятия по 60 минут.", budget: 900, district: "Удалённо", date: "13 ноября, 17:00", urgency: "soon", remote: true, responses: 4, status: "new", createdAt: "2026-11-08T20:15", client: { name: "Марина Котова", avatar: "assets/img/avatars/olga.jpg", rating: 5.0, orders: 21, verified: true } },
    { id: "P-1037", category: "pets", title: "Выгулять корги в обед", desc: "Погулять с корги Ричи 40–50 минут рядом с домом, после прогулки покормить.", budget: 350, district: "Ворошиловский", date: "Сегодня, 13:00", urgency: "today", remote: false, responses: 6, status: "new", createdAt: "2026-11-08T19:40", client: { name: "Анна Смирнова", avatar: "assets/img/avatars/anna.jpg", rating: 4.9, orders: 12, verified: true } },
    { id: "P-1036", category: "beauty", title: "Маникюр на дому к празднику", desc: "Аккуратный нюдовый маникюр с покрытием. Свои инструменты и лампа.", budget: 1500, district: "Киевский", date: "14 ноября, 18:30", urgency: "soon", remote: false, responses: 2, status: "new", createdAt: "2026-11-08T18:20", client: { name: "Марина Котова", avatar: "assets/img/avatars/olga.jpg", rating: 5.0, orders: 21, verified: true } },
    { id: "P-1035", category: "events", title: "Помочь на дне рождения: сервировка и фото", desc: "Семейный праздник на 15 человек: сервировка, встреча гостей и 30–40 фотографий.", budget: 3000, district: "Киевский", date: "15 ноября, 16:00", urgency: "soon", remote: false, responses: 1, status: "new", createdAt: "2026-11-08T16:10", client: { name: "Павел Дорохов", avatar: "assets/img/avatars/sergey.jpg", rating: 4.7, orders: 5, verified: false } },
    { id: "P-1033", category: "cleaning", title: "Генеральная уборка кухни", desc: "Вымыть фасады, плитку, вытяжку и холодильник. Средства есть.", budget: 3200, district: "Ворошиловский", date: "14 ноября, 09:00", urgency: "soon", remote: false, responses: 4, status: "work", createdAt: "2026-11-07T18:05", client: { name: "Анна Смирнова", avatar: "assets/img/avatars/anna.jpg", rating: 4.9, orders: 12, verified: true } },
    { id: "P-1028", category: "repair", title: "Собрать детскую кроватку", desc: "Кроватка-трансформер, инструкция есть. Собрать и проверить устойчивость.", budget: 1000, district: "Ленинский", date: "10 ноября, 12:00", urgency: "soon", remote: false, responses: 4, status: "done", createdAt: "2026-11-05T15:00", client: { name: "Анна Смирнова", avatar: "assets/img/avatars/anna.jpg", rating: 4.9, orders: 12, verified: true } }
  ];

  const team = [
    { name: "Быков Данил Игоревич", initials: "ДБ", role: "Тимлид · продукт и архитектура", text: "Идея, границы продукта, архитектура, планирование, ядро JavaScript, ТЗ и защита." },
    { name: "Довгань Данил Игоревич", initials: "ДД", role: "Front-end-разработчик", text: "Bootstrap-вёрстка, адаптивность, интерфейсы заказов, UX-проверка." },
    { name: "Рассамаха Кирилл Сергеевич", initials: "КР", role: "Контент-менеджер", text: "Категории, тексты, демо-данные и пользовательская документация." }
  ];

  const faq = [
    { q: "Сколько стоит разместить заказ?", a: "Для заказчика бесплатно. Комиссия 12% платится исполнителем после выполнения." },
    { q: "Как выбрать исполнителя?", a: "Смотрите рейтинг, отзывы, количество работ и скорость отклика. Сравните несколько предложений." },
    { q: "Что делать, если исполнитель не пришёл?", a: "Сообщите в поддержку: заказ можно перенести, отменить или передать другому мастеру." },
    { q: "Можно ли работать удалённо?", a: "Да, при создании заказа включите переключатель «Удалённая работа»." },
    { q: "Какая комиссия у исполнителя?", a: "12% с завершённого заказа; для мастеров с рейтингом выше 4,8 — 10%." },
    { q: "Как связаться с поддержкой?", a: "Напишите на help@poruchenie.ru или позвоните +7 (949) 123-45-67." }
  ];

  return { categories, districts, orders, team, faq };
})();
