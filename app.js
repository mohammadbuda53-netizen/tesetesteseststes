const STORAGE_KEY = "craftsmen-app-v1";

const form = document.getElementById("craftsman-form");
const listEl = document.getElementById("list");
const statsEl = document.getElementById("stats");
const filterTradeEl = document.getElementById("filter-trade");
const filterStatusEl = document.getElementById("filter-status");

let craftsmen = loadCraftsmen();

render();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const entry = {
    id: crypto.randomUUID(),
    name: form.name.value.trim(),
    trade: form.trade.value,
    phone: form.phone.value.trim(),
    status: form.status.value,
    priority: form.priority.value,
    note: form.note.value.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!entry.name || !entry.trade) {
    return;
  }

  craftsmen.unshift(entry);
  persistCraftsmen();
  form.reset();
  form.status.value = "frei";
  form.priority.value = "mittel";
  render();
});

filterTradeEl.addEventListener("change", render);
filterStatusEl.addEventListener("change", render);

listEl.addEventListener("change", (event) => {
  const target = event.target;
  const id = target.dataset.id;
  if (!id) return;

  const item = craftsmen.find((c) => c.id === id);
  if (!item) return;

  if (target.dataset.kind === "status") {
    item.status = target.value;
  }

  if (target.dataset.kind === "priority") {
    item.priority = target.value;
  }

  persistCraftsmen();
  render();
});

listEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='delete']");
  if (!button) return;

  const { id } = button.dataset;
  craftsmen = craftsmen.filter((craftsman) => craftsman.id !== id);
  persistCraftsmen();
  render();
});

function loadCraftsmen() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCraftsmen() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(craftsmen));
}

function render() {
  populateTradeFilter();

  const filtered = craftsmen.filter((item) => {
    const byTrade = filterTradeEl.value === "alle" || item.trade === filterTradeEl.value;
    const byStatus = filterStatusEl.value === "alle" || item.status === filterStatusEl.value;
    return byTrade && byStatus;
  });

  renderStats(filtered);

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="empty">Keine Handwerker gefunden. Lege einen neuen Eintrag an oder passe die Filter an.</div>`;
    return;
  }

  listEl.innerHTML = filtered
    .map(
      (item) => `
      <article class="card">
        <div class="card-top">
          <h3>${escapeHtml(item.name)} · ${escapeHtml(item.trade)}</h3>
          <button class="btn danger" data-action="delete" data-id="${item.id}" type="button">Löschen</button>
        </div>

        <div class="meta">
          <span>Telefon: ${escapeHtml(item.phone || "-")}</span>
          <span>Erfasst: ${new Date(item.createdAt).toLocaleDateString("de-DE")}</span>
        </div>

        <div class="controls">
          <label>
            Status
            <select data-kind="status" data-id="${item.id}">
              ${statusOptions(item.status)}
            </select>
          </label>

          <label>
            Priorität
            <select data-kind="priority" data-id="${item.id}">
              ${priorityOptions(item.priority)}
            </select>
          </label>
        </div>

        <div class="meta">Notiz: ${escapeHtml(item.note || "-")}</div>
      </article>
    `
    )
    .join("");
}

function renderStats(entries) {
  const total = entries.length;
  const free = entries.filter((c) => c.status === "frei").length;
  const planned = entries.filter((c) => c.status === "eingeplant").length;
  const busy = entries.filter((c) => c.status === "im Einsatz").length;

  statsEl.innerHTML = `
    <span class="badge">Gesamt: ${total}</span>
    <span class="badge free">frei: ${free}</span>
    <span class="badge planned">eingeplant: ${planned}</span>
    <span class="badge busy">im Einsatz: ${busy}</span>
  `;
}

function populateTradeFilter() {
  const current = filterTradeEl.value || "alle";
  const trades = [...new Set(craftsmen.map((c) => c.trade))].sort((a, b) => a.localeCompare(b, "de"));

  filterTradeEl.innerHTML = `<option value="alle">Alle</option>${trades
    .map((trade) => `<option value="${escapeHtml(trade)}">${escapeHtml(trade)}</option>`)
    .join("")}`;

  filterTradeEl.value = trades.includes(current) || current === "alle" ? current : "alle";
}

function statusOptions(active) {
  const options = ["frei", "eingeplant", "im Einsatz"];
  return options
    .map((value) => `<option value="${value}" ${value === active ? "selected" : ""}>${value}</option>`)
    .join("");
}

function priorityOptions(active) {
  const options = ["niedrig", "mittel", "hoch"];
  return options
    .map((value) => `<option value="${value}" ${value === active ? "selected" : ""}>${value}</option>`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}