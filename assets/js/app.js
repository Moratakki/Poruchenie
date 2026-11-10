/* Поручение — логика двух страниц на vanilla JS + Bootstrap 5 */
(function () {
  "use strict";

  const D = window.PORUCHENIE;
  const KEYS = { orders: "poruchenie_orders_v3", responses: "poruchenie_responses_v3" };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const read = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const Store = {
    init() {
      if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, clone(D.orders));
      if (!localStorage.getItem(KEYS.responses)) write(KEYS.responses, [
        { id: "r1", orderId: "P-1042", responderName: "Максим Орлов", price: 1800, message: "Готов приехать сегодня к 18:00, инструмент свой.", createdAt: "2026-11-09T10:02" },
        { id: "r2", orderId: "P-1042", responderName: "Артём Гончаров", price: 2000, message: "Могу помочь со сборкой и доставкой.", createdAt: "2026-11-09T10:19" }
      ]);
    },
    orders() { return read(KEYS.orders, []); },
    saveOrders(v) { write(KEYS.orders, v); },
    responses() { return read(KEYS.responses, []); },
    saveResponses(v) { write(KEYS.responses, v); },
    addOrder(o) { const list = this.orders(); list.unshift(o); this.saveOrders(list); },
    addResponse(r) {
      const list = this.responses(); list.unshift(r); this.saveResponses(list);
      const o = this.orders().find((x) => x.id === r.orderId);
      if (o) this.saveOrders(this.orders().map((x) => x.id === o.id ? { ...x, responses: Number(x.responses || 0) + 1 } : x));
    }
  };

  const UI = {
    esc(v) { return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); },
    money(v) { return String(Math.round(Number(v) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽"; },
    cat(id) { return D.categories.find((c) => c.id === id) || D.categories[0]; },
    toast(message, type = "success") {
      let area = document.getElementById("toastArea");
      if (!area) { area = document.createElement("div"); area.id = "toastArea"; area.className = "toast-container position-fixed bottom-0 end-0 p-3"; document.body.appendChild(area); }
      const el = document.createElement("div");
      el.className = `toast align-items-center text-bg-${type} border-0`;
      el.innerHTML = `<div class="d-flex"><div class="toast-body">${UI.esc(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
      area.appendChild(el);
      new bootstrap.Toast(el, { delay: 3200 }).show();
      el.addEventListener("hidden.bs.toast", () => el.remove());
    },
    modal(id) { return bootstrap.Modal.getOrCreateInstance(document.getElementById(id)); }
  };

  function orderCard(o) {
    const c = UI.cat(o.category);
    return `<div class="col-md-6 col-xl-4">
      <article class="card order-card h-100" role="button" data-order="${o.id}">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge badge-soft"><i class="bi bi-${c.icon} me-1"></i>${UI.esc(c.name)}</span>
            ${o.urgency === "today" ? '<span class="badge text-bg-danger">Срочно</span>' : ""}
          </div>
          <h3 class="h6 fw-bold mb-2">${UI.esc(o.title)}</h3>
          <p class="text-secondary small flex-grow-1 mb-3">${UI.esc(o.desc.slice(0, 100))}${o.desc.length > 100 ? "…" : ""}</p>
          <div class="d-flex flex-wrap gap-2 order-meta mb-3">
            <span><i class="bi bi-geo-alt me-1"></i>${UI.esc(o.remote ? "Удалённо" : o.district)}</span>
            <span><i class="bi bi-clock me-1"></i>${UI.esc(o.date)}</span>
            <span><i class="bi bi-chat-dots me-1"></i>${o.responses} откл.</span>
          </div>
          <div class="d-flex justify-content-between align-items-center border-top pt-3">
            <span class="order-price">${UI.money(o.budget)}</span>
            <span class="btn btn-sm btn-outline-primary">Подробнее</span>
          </div>
        </div>
      </article></div>`;
  }

  function renderHome() {
    const catBox = document.getElementById("categoriesGrid");
    if (catBox) catBox.innerHTML = D.categories.map((c) => `<div class="col-6 col-md-3">
      <a class="category-card" href="orders.html?category=${c.id}">
        <span class="category-icon"><i class="bi bi-${c.icon}"></i></span>
        <h3>${UI.esc(c.name)}</h3><small>${c.count} задач · от ${UI.money(c.from)}</small>
      </a></div>`).join("");
    const ordersBox = document.getElementById("homeOrders");
    if (ordersBox) ordersBox.innerHTML = Store.orders().filter((o) => o.status === "new").slice(0, 6).map(orderCard).join("");
    const faq = document.getElementById("faqAccordion");
    if (faq) faq.innerHTML = D.faq.map((f, i) => `<div class="accordion-item">
      <h2 class="accordion-header"><button class="accordion-button ${i ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${i}">${UI.esc(f.q)}</button></h2>
      <div id="faq${i}" class="accordion-collapse collapse ${i ? "" : "show"}" data-bs-parent="#faqAccordion"><div class="accordion-body small text-secondary">${UI.esc(f.a)}</div></div></div>`).join("");
    const team = document.getElementById("teamGrid");
    if (team) team.innerHTML = D.team.map((m) => `<div class="col-md-4"><div class="team-card p-3">
      <div class="team-mono mb-3">${m.initials}</div><h3 class="h6 fw-bold mb-1">${UI.esc(m.name)}</h3>
      <div class="small text-primary mb-2">${UI.esc(m.role)}</div><p class="small text-secondary mb-0">${UI.esc(m.text)}</p></div></div>`).join("");
    initCalculator();
  }

  function initCalculator() {
    const cat = document.getElementById("calcCategory");
    if (!cat) return;
    cat.innerHTML = D.categories.map((c) => `<option value="${c.id}">${UI.esc(c.name)}</option>`).join("");
    const volume = document.getElementById("calcVolume"), urgency = document.getElementById("calcUrgency");
    const out = document.getElementById("calcPrice"), cta = document.getElementById("calcCta");
    const update = () => {
      const c = UI.cat(cat.value), v = Number(volume.value) || 1;
      const u = urgency.value === "today" ? 1.25 : urgency.value === "soon" ? 1.08 : 0.95;
      const low = Math.max(300, Math.round((c.from * v * u * 0.9) / 100) * 100);
      const high = Math.round((c.from * v * u * 1.3) / 100) * 100;
      out.innerHTML = `${UI.money(low)} <span class="fs-6 text-secondary">— ${UI.money(high)}</span>`;
      if (cta) cta.href = `orders.html?create=1&category=${c.id}`;
    };
    [cat, volume, urgency].forEach((el) => el.addEventListener("change", update));
    update();
  }

  const state = { q: "", category: "", district: "", max: "", sort: "new" };
  function filteredOrders() {
    let list = Store.orders().filter((o) => o.status === "new");
    if (state.q) list = list.filter((o) => (o.title + " " + o.desc).toLowerCase().includes(state.q.toLowerCase()));
    if (state.category) list = list.filter((o) => o.category === state.category);
    if (state.district) list = list.filter((o) => o.district === state.district);
    if (state.max) list = list.filter((o) => Number(o.budget) <= Number(state.max));
    if (state.sort === "budget") list.sort((a, b) => b.budget - a.budget);
    else if (state.sort === "responses") list.sort((a, b) => b.responses - a.responses);
    else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }
  function renderOrders() {
    const grid = document.getElementById("ordersGrid");
    if (!grid) return;
    const list = filteredOrders();
    grid.innerHTML = list.length ? list.map(orderCard).join("") : `<div class="col-12"><div class="alert alert-light border text-center py-5">Ничего не найдено. <button class="btn btn-sm btn-outline-primary ms-2" id="emptyReset">Сбросить фильтры</button></div></div>`;
    const count = document.getElementById("ordersCount"); if (count) count.textContent = list.length;
    const empty = document.getElementById("emptyReset"); if (empty) empty.addEventListener("click", resetFilters);
  }
  function resetFilters() {
    state.q = state.category = state.district = state.max = ""; state.sort = "new";
    document.getElementById("searchInput").value = ""; document.getElementById("categoryFilter").value = "";
    document.getElementById("districtFilter").value = ""; document.getElementById("budgetFilter").value = "";
    document.getElementById("sortSelect").value = "new"; renderOrders();
  }

  function initOrdersPage() {
    const cat = document.getElementById("categoryFilter"), dist = document.getElementById("districtFilter");
    if (cat) cat.innerHTML = `<option value="">Все категории</option>` + D.categories.map((c) => `<option value="${c.id}">${UI.esc(c.name)}</option>`).join("");
    if (dist) dist.innerHTML = `<option value="">Все районы</option>` + D.districts.map((d) => `<option>${UI.esc(d)}</option>`).join("");
    const createCat = document.getElementById("createCategory");
    if (createCat) createCat.innerHTML = D.categories.map((c) => `<option value="${c.id}">${UI.esc(c.name)}</option>`).join("");
    const createDist = document.getElementById("createDistrict");
    if (createDist) createDist.innerHTML = D.districts.map((d) => `<option>${UI.esc(d)}</option>`).join("");
    const date = document.getElementById("createDate");
    if (date) { const n = new Date(); date.min = new Date(n.getTime() - n.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
    const remote = document.getElementById("createRemote");
    if (remote && createDist) remote.addEventListener("change", () => { createDist.disabled = remote.checked; createDist.required = !remote.checked; });
    const params = new URLSearchParams(location.search);
    if (params.get("category")) state.category = params.get("category");
    if (state.category && cat) cat.value = state.category;
    if (params.get("q")) { state.q = params.get("q"); const s = document.getElementById("searchInput"); if (s) s.value = state.q; }
    renderOrders();
    const bind = (id, ev, fn) => { const el = document.getElementById(id); if (el) el.addEventListener(ev, fn); };
    bind("searchInput", "input", (e) => { state.q = e.target.value.trim(); renderOrders(); });
    bind("categoryFilter", "change", (e) => { state.category = e.target.value; renderOrders(); });
    bind("districtFilter", "change", (e) => { state.district = e.target.value; renderOrders(); });
    bind("budgetFilter", "input", (e) => { state.max = e.target.value; renderOrders(); });
    bind("sortSelect", "change", (e) => { state.sort = e.target.value; renderOrders(); });
    bind("resetFilters", "click", resetFilters);
    document.getElementById("ordersGrid").addEventListener("click", (e) => {
      const card = e.target.closest("[data-order]"); if (card) openOrder(card.dataset.order);
    });
    const createBtn = document.getElementById("createOrderBtn");
    if (createBtn) createBtn.addEventListener("click", () => UI.modal("createOrderModal").show());
    const form = document.getElementById("createOrderForm");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.classList.add("was-validated"); return; }
      const fd = new FormData(form);
      const num = Store.orders().reduce((m, o) => Math.max(m, Number(String(o.id).replace(/\D/g, ""))), 1042) + 1;
      const d = fd.get("date") || new Date().toISOString().slice(0, 10);
      Store.addOrder({
        id: "P-" + num, category: fd.get("category"), title: String(fd.get("title")).trim(),
        desc: String(fd.get("desc")).trim(), budget: Number(fd.get("budget")),
        district: fd.get("remote") ? "Удалённо" : fd.get("district"),
        date: new Date(d + "T12:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
        urgency: fd.get("urgency") || "soon", remote: !!fd.get("remote"), responses: 0, status: "new",
        createdAt: new Date().toISOString(),
        client: { name: String(fd.get("customerName")).trim(), phone: String(fd.get("customerPhone")).trim(), avatar: "assets/img/avatars/anna.jpg", rating: 5, orders: 1, verified: false }
      });
      form.reset(); form.classList.remove("was-validated");
      UI.modal("createOrderModal").hide(); renderOrders();
      UI.toast("Заказ опубликован");
    });
    if (params.get("create") === "1") {
      UI.modal("createOrderModal").show();
      if (params.get("category")) document.getElementById("createCategory").value = params.get("category");
    }
  }

  function openOrder(id) {
    const o = Store.orders().find((x) => x.id === id); if (!o) return;
    const c = UI.cat(o.category);
    document.getElementById("orderModalBody").innerHTML = `<div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge badge-soft"><i class="bi bi-${c.icon} me-1"></i>${UI.esc(c.name)}</span><span class="small text-secondary">${o.id}</span></div>
      <h3 class="h4 fw-bold">${UI.esc(o.title)}</h3><p class="text-secondary">${UI.esc(o.desc)}</p>
      <div class="row g-2 my-3">
        <div class="col-6"><div class="border rounded p-2"><div class="small text-secondary">Бюджет</div><div class="fw-bold">${UI.money(o.budget)}</div></div></div>
        <div class="col-6"><div class="border rounded p-2"><div class="small text-secondary">Срок</div><div class="fw-bold">${UI.esc(o.date)}</div></div></div>
        <div class="col-6"><div class="border rounded p-2"><div class="small text-secondary">Район</div><div class="fw-bold">${UI.esc(o.district)}</div></div></div>
        <div class="col-6"><div class="border rounded p-2"><div class="small text-secondary">Откликов</div><div class="fw-bold">${o.responses}</div></div></div>
      </div>
      <div class="d-flex align-items-center gap-2 border-top pt-3"><img src="${UI.esc(o.client.avatar)}" class="avatar" alt="">
      <div><div class="fw-semibold">${UI.esc(o.client.name)}</div><div class="small text-secondary">рейтинг ${o.client.rating} · ${o.client.orders} заказов</div></div></div>`;
    document.getElementById("orderModalFooter").innerHTML = `<button class="btn btn-primary" type="button" id="showRespond">Откликнуться</button>`;
    const modal = UI.modal("orderModal"); modal.show();
    document.getElementById("showRespond").addEventListener("click", () => {
      document.getElementById("orderModalFooter").innerHTML = `<form id="respondForm" class="w-100">
        <div class="row g-2">
          <div class="col-md-4"><label class="form-label small">Ваше имя</label><input class="form-control" name="name" required minlength="2" placeholder="Имя"></div>
          <div class="col-md-8"><label class="form-label small">Сообщение</label><input class="form-control" name="message" required minlength="10" placeholder="Когда сможете выполнить и что входит в цену"></div>
          <div class="col-md-4"><label class="form-label small">Цена, ₽</label><input class="form-control" name="price" type="number" min="100" value="${o.budget}" required></div>
          <div class="col-md-8 d-flex align-items-end"><button class="btn btn-primary w-100" type="submit">Отправить отклик</button></div>
        </div></form>`;
      document.getElementById("respondForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        Store.addResponse({ id: "r-" + Date.now(), orderId: o.id, responderName: String(fd.get("name")).trim(), price: Number(fd.get("price")), message: String(fd.get("message")).trim(), createdAt: new Date().toISOString() });
        modal.hide(); renderOrders(); UI.toast("Отклик отправлен");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    Store.init();
    const page = document.body.dataset.page;
    if (page === "home") renderHome();
    if (page === "orders") initOrdersPage();
  });
})();
