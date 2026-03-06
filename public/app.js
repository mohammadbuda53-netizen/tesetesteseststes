const API = '/api';

let workers = [], customers = [], jobs = [], timeEntries = [];
let editingId = null;
let currentModalType = null;

document.querySelectorAll('.nav-menu li').forEach(li => {
  li.addEventListener('click', () => {
    document.querySelectorAll('.nav-menu li').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    li.classList.add('active');
    document.getElementById(li.dataset.view).classList.add('active');
  });
});

async function loadDashboard() {
  const data = await fetch(`${API}/dashboard`).then(r => r.json());
  document.getElementById('workerCount').textContent = data.workers.length;
  document.getElementById('jobCount').textContent = data.jobs.length;
  document.getElementById('todayHours').textContent = data.todayEntries.reduce((s, e) => s + e.hours, 0).toFixed(1);
  document.getElementById('totalRevenue').textContent = data.totalRevenue.toLocaleString('de-DE') + '€';
  
  const recentJobs = document.getElementById('recentJobs');
  if (data.jobs.length === 0) {
    recentJobs.innerHTML = '<div class="empty-state">Keine aktiven Aufträge</div>';
  } else {
    recentJobs.innerHTML = data.jobs.slice(0, 5).map(job => `
      <div class="job-item">
        <div class="job-info">
          <h3>${job.title}</h3>
          <p>${job.customerName || 'Kein Kunde'}</p>
        </div>
        <span class="badge badge-${job.status}">${job.status}</span>
      </div>
    `).join('');
  }
}

async function loadWorkers() {
  workers = await fetch(`${API}/workers`).then(r => r.json());
  const list = document.getElementById('workersList');
  if (workers.length === 0) {
    list.innerHTML = '<div class="empty-state">Keine Mitarbeiter vorhanden</div>';
  } else {
    list.innerHTML = workers.map(w => `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${w.name}</div>
            <div class="card-subtitle">${w.specialty || 'Handwerker'}</div>
          </div>
          <span class="badge ${w.active ? 'badge-active' : 'badge-inactive'}">${w.active ? 'Aktiv' : 'Inaktiv'}</span>
        </div>
        <div class="card-body">
          <p>📧 ${w.email || '-'}</p>
          <p>📞 ${w.phone || '-'}</p>
          <p>💰 ${w.hourlyRate || 0}€/h</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-small" onclick="editItem('worker', ${w.id})">Bearbeiten</button>
          <button class="btn btn-danger btn-small" onclick="deleteItem('worker', ${w.id})">Löschen</button>
        </div>
      </div>
    `).join('');
  }
}

async function loadCustomers() {
  customers = await fetch(`${API}/customers`).then(r => r.json());
  const list = document.getElementById('customersList');
  if (customers.length === 0) {
    list.innerHTML = '<div class="empty-state">Keine Kunden vorhanden</div>';
  } else {
    list.innerHTML = customers.map(c => `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${c.name}</div>
            <div class="card-subtitle">${c.company || 'Privatkunde'}</div>
          </div>
        </div>
        <div class="card-body">
          <p>📧 ${c.email || '-'}</p>
          <p>📞 ${c.phone || '-'}</p>
          <p>📍 ${c.address || '-'}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-small" onclick="editItem('customer', ${c.id})">Bearbeiten</button>
          <button class="btn btn-danger btn-small" onclick="deleteItem('customer', ${c.id})">Löschen</button>
        </div>
      </div>
    `).join('');
  }
}

async function loadJobs() {
  jobs = await fetch(`${API}/jobs`).then(r => r.json());
  const list = document.getElementById('jobsList');
  if (jobs.length === 0) {
    list.innerHTML = '<div class="empty-state">Keine Aufträge vorhanden</div>';
  } else {
    list.innerHTML = jobs.map(j => `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${j.title}</div>
            <div class="card-subtitle">${j.customerName || 'Kein Kunde'}</div>
          </div>
          <span class="badge badge-${j.status}">${j.status}</span>
        </div>
        <div class="card-body">
          <p>📝 ${j.description || '-'}</p>
          <p>📅 ${j.startDate || '-'} - ${j.endDate || '-'}</p>
          <p>💰 ${j.price?.toLocaleString('de-DE') || 0}€</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-small" onclick="editItem('job', ${j.id})">Bearbeiten</button>
          <button class="btn btn-danger btn-small" onclick="deleteItem('job', ${j.id})">Löschen</button>
        </div>
      </div>
    `).join('');
  }
}

async function loadTimeEntries() {
  timeEntries = await fetch(`${API}/time-entries`).then(r => r.json());
  const list = document.getElementById('timeEntriesList');
  if (timeEntries.length === 0) {
    list.innerHTML = '<div class="empty-state">Keine Zeiteinträge vorhanden</div>';
  } else {
    list.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Mitarbeiter</th>
            <th>Auftrag</th>
            <th>Stunden</th>
            <th>Beschreibung</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${timeEntries.map(t => `
            <tr>
              <td>${t.date}</td>
              <td>${t.workerName || '-'}</td>
              <td>${t.jobTitle || '-'}</td>
              <td>${t.hours}h</td>
              <td>${t.description || '-'}</td>
              <td><button class="btn btn-danger btn-small" onclick="deleteItem('timeEntry', ${t.id})">✕</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

function showModal(type, item = null) {
  currentModalType = type;
  editingId = item?.id || null;
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('modalForm');
  
  const titles = {
    worker: item ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter',
    customer: item ? 'Kunde bearbeiten' : 'Neuer Kunde',
    job: item ? 'Auftrag bearbeiten' : 'Neuer Auftrag',
    timeEntry: 'Neuer Zeiteintrag'
  };
  title.textContent = titles[type];
  
  const forms = {
    worker: `
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" value="${item?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>E-Mail</label>
        <input type="email" name="email" value="${item?.email || ''}">
      </div>
      <div class="form-group">
        <label>Telefon</label>
        <input type="tel" name="phone" value="${item?.phone || ''}">
      </div>
      <div class="form-group">
        <label>Fachgebiet</label>
        <input type="text" name="specialty" value="${item?.specialty || ''}">
      </div>
      <div class="form-group">
        <label>Stundensatz (€)</label>
        <input type="number" name="hourlyRate" value="${item?.hourlyRate || 0}" step="0.01">
      </div>
      <div class="form-group">
        <label>Aktiv</label>
        <select name="active">
          <option value="1" ${item?.active === 1 ? 'selected' : ''}>Ja</option>
          <option value="0" ${item?.active === 0 ? 'selected' : ''}>Nein</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Speichern</button>
      </div>
    `,
    customer: `
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" value="${item?.name || ''}" required>
      </div>
      <div class="form-group">
        <label>Firma</label>
        <input type="text" name="company" value="${item?.company || ''}">
      </div>
      <div class="form-group">
        <label>E-Mail</label>
        <input type="email" name="email" value="${item?.email || ''}">
      </div>
      <div class="form-group">
        <label>Telefon</label>
        <input type="tel" name="phone" value="${item?.phone || ''}">
      </div>
      <div class="form-group">
        <label>Adresse</label>
        <input type="text" name="address" value="${item?.address || ''}">
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Speichern</button>
      </div>
    `,
    job: `
      <div class="form-group">
        <label>Titel</label>
        <input type="text" name="title" value="${item?.title || ''}" required>
      </div>
      <div class="form-group">
        <label>Kunde</label>
        <select name="customerId">
          <option value="">-- Kein Kunde --</option>
          ${customers.map(c => `<option value="${c.id}" ${item?.customerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Beschreibung</label>
        <textarea name="description">${item?.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Status</label>
        <select name="status">
          <option value="offen" ${item?.status === 'offen' ? 'selected' : ''}>Offen</option>
          <option value="in Bearbeitung" ${item?.status === 'in Bearbeitung' ? 'selected' : ''}>In Bearbeitung</option>
          <option value="abgeschlossen" ${item?.status === 'abgeschlossen' ? 'selected' : ''}>Abgeschlossen</option>
          <option value="fakturiert" ${item?.status === 'fakturiert' ? 'selected' : ''}>Fakturiert</option>
        </select>
      </div>
      <div class="form-group">
        <label>Startdatum</label>
        <input type="date" name="startDate" value="${item?.startDate || ''}">
      </div>
      <div class="form-group">
        <label>Enddatum</label>
        <input type="date" name="endDate" value="${item?.endDate || ''}">
      </div>
      <div class="form-group">
        <label>Preis (€)</label>
        <input type="number" name="price" value="${item?.price || 0}" step="0.01">
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Speichern</button>
      </div>
    `,
    timeEntry: `
      <div class="form-group">
        <label>Mitarbeiter</label>
        <select name="workerId" required>
          <option value="">-- Auswählen --</option>
          ${workers.map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Auftrag</label>
        <select name="jobId">
          <option value="">-- Kein Auftrag --</option>
          ${jobs.map(j => `<option value="${j.id}">${j.title}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Datum</label>
        <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required>
      </div>
      <div class="form-group">
        <label>Stunden</label>
        <input type="number" name="hours" value="0" step="0.5" required>
      </div>
      <div class="form-group">
        <label>Beschreibung</label>
        <textarea name="description"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Speichern</button>
      </div>
    `
  };
  
  form.innerHTML = forms[type];
  form.onsubmit = (e) => saveItem(e, type);
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  editingId = null;
  currentModalType = null;
}

async function saveItem(e, type) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  if (type === 'timeEntry' || type === 'job') {
    data.price = parseFloat(data.price) || 0;
    data.hourlyRate = parseFloat(data.hourlyRate) || 0;
    data.hours = parseFloat(data.hours) || 0;
    data.customerId = data.customerId ? parseInt(data.customerId) : null;
    data.workerId = data.workerId ? parseInt(data.workerId) : null;
    data.jobId = data.jobId ? parseInt(data.jobId) : null;
  }
  
  const method = editingId ? 'PUT' : 'POST';
  const endpoint = editingId ? `${API}/${type === 'timeEntry' ? 'time-entries' : type + 's'}/${editingId}` : `${API}/${type === 'timeEntry' ? 'time-entries' : type + 's'}`;
  
  await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  closeModal();
  refreshCurrentView();
}

function editItem(type, id) {
  let item;
  if (type === 'worker') item = workers.find(w => w.id === id);
  else if (type === 'customer') item = customers.find(c => c.id === id);
  else if (type === 'job') item = jobs.find(j => j.id === id);
  else if (type === 'timeEntry') item = timeEntries.find(t => t.id === id);
  showModal(type, item);
}

async function deleteItem(type, id) {
  if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return;
  
  const endpoints = {
    worker: 'workers',
    customer: 'customers',
    job: 'jobs',
    timeEntry: 'time-entries'
  };
  
  await fetch(`${API}/${endpoints[type]}/${id}`, { method: 'DELETE' });
  refreshCurrentView();
}

function refreshCurrentView() {
  const activeView = document.querySelector('.nav-menu li.active')?.dataset.view;
  if (activeView === 'dashboard') loadDashboard();
  else if (activeView === 'workers') loadWorkers();
  else if (activeView === 'customers') loadCustomers();
  else if (activeView === 'jobs') loadJobs();
  else if (activeView === 'time') loadTimeEntries();
}

loadDashboard();
