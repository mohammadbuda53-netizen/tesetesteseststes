// API Base URL
const API_BASE = window.location.origin;

// Current data cache
let craftsmen = [];
let customers = [];
let jobs = [];
let appointments = [];
let invoices = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    showDashboard();
});

// ==================== TAB SWITCHING ====================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for that tab
    switch(tabName) {
        case 'dashboard':
            showDashboard();
            break;
        case 'craftsmen':
            loadCraftsmen();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'jobs':
            loadJobs();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'invoices':
            loadInvoices();
            break;
    }
}

// ==================== DATA LOADING ====================

async function loadAllData() {
    await Promise.all([
        loadCraftsmen(),
        loadCustomers(),
        loadJobs(),
        loadAppointments(),
        loadInvoices()
    ]);
}

async function loadCraftsmen() {
    try {
        const response = await fetch(`${API_BASE}/api/craftsmen`);
        craftsmen = await response.json();
        renderCraftsmen();
    } catch (error) {
        console.error('Error loading craftsmen:', error);
    }
}

async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/api/customers`);
        customers = await response.json();
        renderCustomers();
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function loadJobs() {
    try {
        const response = await fetch(`${API_BASE}/api/jobs`);
        jobs = await response.json();
        renderJobs();
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
}

async function loadAppointments() {
    try {
        const response = await fetch(`${API_BASE}/api/appointments`);
        appointments = await response.json();
        renderAppointments();
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function loadInvoices() {
    try {
        const response = await fetch(`${API_BASE}/api/invoices`);
        invoices = await response.json();
        renderInvoices();
    } catch (error) {
        console.error('Error loading invoices:', error);
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const stats = await response.json();
        renderStats(stats);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ==================== DASHBOARD ====================

async function showDashboard() {
    await loadStats();
    renderRecentJobs();
    renderUpcomingAppointments();
}

function renderStats(stats) {
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h3>Handwerker Gesamt</h3>
            <div class="stat-value">${stats.totalCraftsmen}</div>
        </div>
        <div class="stat-card">
            <h3>Verfügbare Handwerker</h3>
            <div class="stat-value">${stats.availableCraftsmen}</div>
        </div>
        <div class="stat-card">
            <h3>Aktive Aufträge</h3>
            <div class="stat-value">${stats.activeJobs}</div>
        </div>
        <div class="stat-card">
            <h3>Ausstehende Aufträge</h3>
            <div class="stat-value">${stats.pendingJobs}</div>
        </div>
        <div class="stat-card">
            <h3>Abgeschlossene Aufträge</h3>
            <div class="stat-value">${stats.completedJobs}</div>
        </div>
        <div class="stat-card">
            <h3>Kunden Gesamt</h3>
            <div class="stat-value">${stats.totalCustomers}</div>
        </div>
        <div class="stat-card">
            <h3>Kommende Termine</h3>
            <div class="stat-value">${stats.upcomingAppointments}</div>
        </div>
        <div class="stat-card">
            <h3>Offene Rechnungen</h3>
            <div class="stat-value">${stats.pendingInvoices}</div>
        </div>
    `;
}

function renderRecentJobs() {
    const container = document.getElementById('recent-jobs');
    const recentJobs = jobs.slice(-5).reverse();
    
    if (recentJobs.length === 0) {
        container.innerHTML = '<div class="empty-state">Keine Aufträge vorhanden</div>';
        return;
    }
    
    container.innerHTML = recentJobs.map(job => {
        const customer = customers.find(c => c.id === job.customerId);
        const craftsman = craftsmen.find(c => c.id === job.craftsmanId);
        return `
            <div class="data-card" style="margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <strong>${job.title}</strong><br>
                        <small>Kunde: ${customer?.name || 'N/A'} | Handwerker: ${craftsman?.name || 'N/A'}</small>
                    </div>
                    <span class="badge badge-${job.status}">${getStatusText(job.status)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderUpcomingAppointments() {
    const container = document.getElementById('upcoming-appointments');
    const upcoming = appointments
        .filter(a => a.status === 'scheduled')
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<div class="empty-state">Keine kommenden Termine</div>';
        return;
    }
    
    container.innerHTML = upcoming.map(apt => {
        const customer = customers.find(c => c.id === apt.customerId);
        const craftsman = craftsmen.find(c => c.id === apt.craftsmanId);
        return `
            <div class="data-card" style="margin-bottom: 0.5rem;">
                <div>
                    <strong>${apt.date} ${apt.startTime}</strong><br>
                    <small>Kunde: ${customer?.name || 'N/A'} | Handwerker: ${craftsman?.name || 'N/A'}</small>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== CRAFTSMEN ====================

function renderCraftsmen() {
    const container = document.getElementById('craftsmen-list');
    
    if (craftsmen.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👷</div>
                <div class="empty-state-text">Keine Handwerker vorhanden</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = craftsmen.map(craftsman => `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">${craftsman.name}</div>
                <div class="data-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editCraftsman(${craftsman.id})">✏️ Bearbeiten</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCraftsman(${craftsman.id})">🗑️ Löschen</button>
                </div>
            </div>
            <div class="data-card-body">
                <div class="data-field">
                    <div class="data-field-label">Fachgebiet:</div>
                    <div class="data-field-value">${craftsman.specialty}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Telefon:</div>
                    <div class="data-field-value">${craftsman.phone}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">E-Mail:</div>
                    <div class="data-field-value">${craftsman.email}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Stundensatz:</div>
                    <div class="data-field-value">${craftsman.hourlyRate}€/Std</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Status:</div>
                    <div class="data-field-value"><span class="badge badge-${craftsman.status}">${getStatusText(craftsman.status)}</span></div>
                </div>
            </div>
        </div>
    `).join('');
}

function showCraftsmanModal(craftsmanId = null) {
    const craftsman = craftsmanId ? craftsmen.find(c => c.id === craftsmanId) : null;
    const title = craftsman ? 'Handwerker bearbeiten' : 'Neuer Handwerker';
    
    showModal(title, `
        <form id="craftsman-form" onsubmit="saveCraftsman(event, ${craftsmanId})">
            <div class="form-group">
                <label class="form-label">Name*</label>
                <input type="text" class="form-input" name="name" value="${craftsman?.name || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Fachgebiet*</label>
                <input type="text" class="form-input" name="specialty" value="${craftsman?.specialty || ''}" placeholder="z.B. Elektriker, Klempner, Maler" required>
            </div>
            <div class="form-group">
                <label class="form-label">Telefon*</label>
                <input type="tel" class="form-input" name="phone" value="${craftsman?.phone || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">E-Mail*</label>
                <input type="email" class="form-input" name="email" value="${craftsman?.email || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Stundensatz (€)*</label>
                <input type="number" class="form-input" name="hourlyRate" value="${craftsman?.hourlyRate || ''}" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Status*</label>
                <select class="form-select" name="status" required>
                    <option value="available" ${craftsman?.status === 'available' ? 'selected' : ''}>Verfügbar</option>
                    <option value="busy" ${craftsman?.status === 'busy' ? 'selected' : ''}>Beschäftigt</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Abbrechen</button>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
        </form>
    `);
}

async function saveCraftsman(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        specialty: formData.get('specialty'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        hourlyRate: parseFloat(formData.get('hourlyRate')),
        status: formData.get('status')
    };
    
    try {
        const url = id ? `${API_BASE}/api/craftsmen/${id}` : `${API_BASE}/api/craftsmen`;
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeModal();
        await loadCraftsmen();
    } catch (error) {
        console.error('Error saving craftsman:', error);
        alert('Fehler beim Speichern!');
    }
}

function editCraftsman(id) {
    showCraftsmanModal(id);
}

async function deleteCraftsman(id) {
    if (!confirm('Möchten Sie diesen Handwerker wirklich löschen?')) return;
    
    try {
        await fetch(`${API_BASE}/api/craftsmen/${id}`, { method: 'DELETE' });
        await loadCraftsmen();
    } catch (error) {
        console.error('Error deleting craftsman:', error);
        alert('Fehler beim Löschen!');
    }
}

// ==================== CUSTOMERS ====================

function renderCustomers() {
    const container = document.getElementById('customers-list');
    
    if (customers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <div class="empty-state-text">Keine Kunden vorhanden</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = customers.map(customer => `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">${customer.name}</div>
                <div class="data-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editCustomer(${customer.id})">✏️ Bearbeiten</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">🗑️ Löschen</button>
                </div>
            </div>
            <div class="data-card-body">
                <div class="data-field">
                    <div class="data-field-label">Adresse:</div>
                    <div class="data-field-value">${customer.address}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Telefon:</div>
                    <div class="data-field-value">${customer.phone}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">E-Mail:</div>
                    <div class="data-field-value">${customer.email}</div>
                </div>
                ${customer.notes ? `
                <div class="data-field">
                    <div class="data-field-label">Notizen:</div>
                    <div class="data-field-value">${customer.notes}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function showCustomerModal(customerId = null) {
    const customer = customerId ? customers.find(c => c.id === customerId) : null;
    const title = customer ? 'Kunde bearbeiten' : 'Neuer Kunde';
    
    showModal(title, `
        <form id="customer-form" onsubmit="saveCustomer(event, ${customerId})">
            <div class="form-group">
                <label class="form-label">Name*</label>
                <input type="text" class="form-input" name="name" value="${customer?.name || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Adresse*</label>
                <input type="text" class="form-input" name="address" value="${customer?.address || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Telefon*</label>
                <input type="tel" class="form-input" name="phone" value="${customer?.phone || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">E-Mail*</label>
                <input type="email" class="form-input" name="email" value="${customer?.email || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Notizen</label>
                <textarea class="form-textarea" name="notes">${customer?.notes || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Abbrechen</button>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
        </form>
    `);
}

async function saveCustomer(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        notes: formData.get('notes')
    };
    
    try {
        const url = id ? `${API_BASE}/api/customers/${id}` : `${API_BASE}/api/customers`;
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeModal();
        await loadCustomers();
    } catch (error) {
        console.error('Error saving customer:', error);
        alert('Fehler beim Speichern!');
    }
}

function editCustomer(id) {
    showCustomerModal(id);
}

async function deleteCustomer(id) {
    if (!confirm('Möchten Sie diesen Kunden wirklich löschen?')) return;
    
    try {
        await fetch(`${API_BASE}/api/customers/${id}`, { method: 'DELETE' });
        await loadCustomers();
    } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Fehler beim Löschen!');
    }
}

// ==================== JOBS ====================

function renderJobs() {
    const container = document.getElementById('jobs-list');
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">Keine Aufträge vorhanden</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobs.map(job => {
        const customer = customers.find(c => c.id === job.customerId);
        const craftsman = craftsmen.find(c => c.id === job.craftsmanId);
        
        return `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">${job.title}</div>
                <div class="data-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editJob(${job.id})">✏️ Bearbeiten</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">🗑️ Löschen</button>
                </div>
            </div>
            <div class="data-card-body">
                <div class="data-field">
                    <div class="data-field-label">Beschreibung:</div>
                    <div class="data-field-value">${job.description}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Kunde:</div>
                    <div class="data-field-value">${customer?.name || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Handwerker:</div>
                    <div class="data-field-value">${craftsman?.name || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Status:</div>
                    <div class="data-field-value"><span class="badge badge-${job.status}">${getStatusText(job.status)}</span></div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Priorität:</div>
                    <div class="data-field-value"><span class="badge badge-${job.priority}">${getPriorityText(job.priority)}</span></div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Geplante Stunden:</div>
                    <div class="data-field-value">${job.estimatedHours}h</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Tatsächliche Stunden:</div>
                    <div class="data-field-value">${job.actualHours}h</div>
                </div>
                ${job.scheduledDate ? `
                <div class="data-field">
                    <div class="data-field-label">Geplantes Datum:</div>
                    <div class="data-field-value">${job.scheduledDate}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `}).join('');
}

function showJobModal(jobId = null) {
    const job = jobId ? jobs.find(j => j.id === jobId) : null;
    const title = job ? 'Auftrag bearbeiten' : 'Neuer Auftrag';
    
    const customerOptions = customers.map(c => 
        `<option value="${c.id}" ${job?.customerId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    
    const craftsmanOptions = craftsmen.map(c => 
        `<option value="${c.id}" ${job?.craftsmanId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    
    showModal(title, `
        <form id="job-form" onsubmit="saveJob(event, ${jobId})">
            <div class="form-group">
                <label class="form-label">Titel*</label>
                <input type="text" class="form-input" name="title" value="${job?.title || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Beschreibung*</label>
                <textarea class="form-textarea" name="description" required>${job?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Kunde*</label>
                <select class="form-select" name="customerId" required>
                    <option value="">Kunde auswählen...</option>
                    ${customerOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Handwerker*</label>
                <select class="form-select" name="craftsmanId" required>
                    <option value="">Handwerker auswählen...</option>
                    ${craftsmanOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status*</label>
                <select class="form-select" name="status" required>
                    <option value="pending" ${job?.status === 'pending' ? 'selected' : ''}>Ausstehend</option>
                    <option value="in-progress" ${job?.status === 'in-progress' ? 'selected' : ''}>In Bearbeitung</option>
                    <option value="completed" ${job?.status === 'completed' ? 'selected' : ''}>Abgeschlossen</option>
                    <option value="cancelled" ${job?.status === 'cancelled' ? 'selected' : ''}>Abgebrochen</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Priorität*</label>
                <select class="form-select" name="priority" required>
                    <option value="low" ${job?.priority === 'low' ? 'selected' : ''}>Niedrig</option>
                    <option value="medium" ${job?.priority === 'medium' ? 'selected' : ''}>Mittel</option>
                    <option value="high" ${job?.priority === 'high' ? 'selected' : ''}>Hoch</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Geplante Stunden*</label>
                <input type="number" class="form-input" name="estimatedHours" value="${job?.estimatedHours || ''}" step="0.5" required>
            </div>
            <div class="form-group">
                <label class="form-label">Tatsächliche Stunden</label>
                <input type="number" class="form-input" name="actualHours" value="${job?.actualHours || 0}" step="0.5">
            </div>
            <div class="form-group">
                <label class="form-label">Geplantes Datum</label>
                <input type="date" class="form-input" name="scheduledDate" value="${job?.scheduledDate || ''}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Abbrechen</button>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
        </form>
    `);
}

async function saveJob(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        customerId: parseInt(formData.get('customerId')),
        craftsmanId: parseInt(formData.get('craftsmanId')),
        status: formData.get('status'),
        priority: formData.get('priority'),
        estimatedHours: parseFloat(formData.get('estimatedHours')),
        actualHours: parseFloat(formData.get('actualHours')),
        scheduledDate: formData.get('scheduledDate')
    };
    
    try {
        const url = id ? `${API_BASE}/api/jobs/${id}` : `${API_BASE}/api/jobs`;
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeModal();
        await loadJobs();
    } catch (error) {
        console.error('Error saving job:', error);
        alert('Fehler beim Speichern!');
    }
}

function editJob(id) {
    showJobModal(id);
}

async function deleteJob(id) {
    if (!confirm('Möchten Sie diesen Auftrag wirklich löschen?')) return;
    
    try {
        await fetch(`${API_BASE}/api/jobs/${id}`, { method: 'DELETE' });
        await loadJobs();
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Fehler beim Löschen!');
    }
}

// ==================== APPOINTMENTS ====================

function renderAppointments() {
    const container = document.getElementById('appointments-list');
    
    if (appointments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <div class="empty-state-text">Keine Termine vorhanden</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appointments.map(apt => {
        const customer = customers.find(c => c.id === apt.customerId);
        const craftsman = craftsmen.find(c => c.id === apt.craftsmanId);
        const job = jobs.find(j => j.id === apt.jobId);
        
        return `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">${apt.date} - ${apt.startTime} bis ${apt.endTime}</div>
                <div class="data-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editAppointment(${apt.id})">✏️ Bearbeiten</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${apt.id})">🗑️ Löschen</button>
                </div>
            </div>
            <div class="data-card-body">
                <div class="data-field">
                    <div class="data-field-label">Auftrag:</div>
                    <div class="data-field-value">${job?.title || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Kunde:</div>
                    <div class="data-field-value">${customer?.name || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Handwerker:</div>
                    <div class="data-field-value">${craftsman?.name || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Status:</div>
                    <div class="data-field-value"><span class="badge badge-${apt.status}">${getStatusText(apt.status)}</span></div>
                </div>
                ${apt.notes ? `
                <div class="data-field">
                    <div class="data-field-label">Notizen:</div>
                    <div class="data-field-value">${apt.notes}</div>
                </div>
                ` : ''}
            </div>
        </div>
    `}).join('');
}

function showAppointmentModal(appointmentId = null) {
    const apt = appointmentId ? appointments.find(a => a.id === appointmentId) : null;
    const title = apt ? 'Termin bearbeiten' : 'Neuer Termin';
    
    const jobOptions = jobs.map(j => 
        `<option value="${j.id}" ${apt?.jobId === j.id ? 'selected' : ''}>${j.title}</option>`
    ).join('');
    
    const customerOptions = customers.map(c => 
        `<option value="${c.id}" ${apt?.customerId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    
    const craftsmanOptions = craftsmen.map(c => 
        `<option value="${c.id}" ${apt?.craftsmanId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    
    showModal(title, `
        <form id="appointment-form" onsubmit="saveAppointment(event, ${appointmentId})">
            <div class="form-group">
                <label class="form-label">Auftrag*</label>
                <select class="form-select" name="jobId" required>
                    <option value="">Auftrag auswählen...</option>
                    ${jobOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Kunde*</label>
                <select class="form-select" name="customerId" required>
                    <option value="">Kunde auswählen...</option>
                    ${customerOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Handwerker*</label>
                <select class="form-select" name="craftsmanId" required>
                    <option value="">Handwerker auswählen...</option>
                    ${craftsmanOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Datum*</label>
                <input type="date" class="form-input" name="date" value="${apt?.date || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Startzeit*</label>
                <input type="time" class="form-input" name="startTime" value="${apt?.startTime || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Endzeit*</label>
                <input type="time" class="form-input" name="endTime" value="${apt?.endTime || ''}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Status*</label>
                <select class="form-select" name="status" required>
                    <option value="scheduled" ${apt?.status === 'scheduled' ? 'selected' : ''}>Geplant</option>
                    <option value="completed" ${apt?.status === 'completed' ? 'selected' : ''}>Abgeschlossen</option>
                    <option value="cancelled" ${apt?.status === 'cancelled' ? 'selected' : ''}>Abgebrochen</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Notizen</label>
                <textarea class="form-textarea" name="notes">${apt?.notes || ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Abbrechen</button>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
        </form>
    `);
}

async function saveAppointment(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        jobId: parseInt(formData.get('jobId')),
        customerId: parseInt(formData.get('customerId')),
        craftsmanId: parseInt(formData.get('craftsmanId')),
        date: formData.get('date'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        status: formData.get('status'),
        notes: formData.get('notes')
    };
    
    try {
        const url = id ? `${API_BASE}/api/appointments/${id}` : `${API_BASE}/api/appointments`;
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeModal();
        await loadAppointments();
    } catch (error) {
        console.error('Error saving appointment:', error);
        alert('Fehler beim Speichern!');
    }
}

function editAppointment(id) {
    showAppointmentModal(id);
}

async function deleteAppointment(id) {
    if (!confirm('Möchten Sie diesen Termin wirklich löschen?')) return;
    
    try {
        await fetch(`${API_BASE}/api/appointments/${id}`, { method: 'DELETE' });
        await loadAppointments();
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Fehler beim Löschen!');
    }
}

// ==================== INVOICES ====================

function renderInvoices() {
    const container = document.getElementById('invoices-list');
    
    if (invoices.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💶</div>
                <div class="empty-state-text">Keine Rechnungen vorhanden</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = invoices.map(invoice => {
        const customer = customers.find(c => c.id === invoice.customerId);
        const job = jobs.find(j => j.id === invoice.jobId);
        
        return `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">Rechnung #${invoice.id}</div>
                <div class="data-card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editInvoice(${invoice.id})">✏️ Bearbeiten</button>
                </div>
            </div>
            <div class="data-card-body">
                <div class="data-field">
                    <div class="data-field-label">Auftrag:</div>
                    <div class="data-field-value">${job?.title || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Kunde:</div>
                    <div class="data-field-value">${customer?.name || 'N/A'}</div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Betrag:</div>
                    <div class="data-field-value"><strong>${invoice.amount.toFixed(2)}€</strong></div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Status:</div>
                    <div class="data-field-value"><span class="badge badge-${invoice.status}">${getStatusText(invoice.status)}</span></div>
                </div>
                <div class="data-field">
                    <div class="data-field-label">Fälligkeitsdatum:</div>
                    <div class="data-field-value">${invoice.dueDate}</div>
                </div>
            </div>
        </div>
    `}).join('');
}

function showInvoiceModal(invoiceId = null) {
    const invoice = invoiceId ? invoices.find(i => i.id === invoiceId) : null;
    const title = invoice ? 'Rechnung bearbeiten' : 'Neue Rechnung';
    
    const jobOptions = jobs.map(j => 
        `<option value="${j.id}" ${invoice?.jobId === j.id ? 'selected' : ''}>${j.title}</option>`
    ).join('');
    
    const customerOptions = customers.map(c => 
        `<option value="${c.id}" ${invoice?.customerId === c.id ? 'selected' : ''}>${c.name}</option>`
    ).join('');
    
    showModal(title, `
        <form id="invoice-form" onsubmit="saveInvoice(event, ${invoiceId})">
            <div class="form-group">
                <label class="form-label">Auftrag*</label>
                <select class="form-select" name="jobId" required>
                    <option value="">Auftrag auswählen...</option>
                    ${jobOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Kunde*</label>
                <select class="form-select" name="customerId" required>
                    <option value="">Kunde auswählen...</option>
                    ${customerOptions}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Betrag (€)*</label>
                <input type="number" class="form-input" name="amount" value="${invoice?.amount || ''}" step="0.01" required>
            </div>
            <div class="form-group">
                <label class="form-label">Status*</label>
                <select class="form-select" name="status" required>
                    <option value="pending" ${invoice?.status === 'pending' ? 'selected' : ''}>Ausstehend</option>
                    <option value="paid" ${invoice?.status === 'paid' ? 'selected' : ''}>Bezahlt</option>
                    <option value="overdue" ${invoice?.status === 'overdue' ? 'selected' : ''}>Überfällig</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Fälligkeitsdatum*</label>
                <input type="date" class="form-input" name="dueDate" value="${invoice?.dueDate || ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Abbrechen</button>
                <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
        </form>
    `);
}

async function saveInvoice(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        jobId: parseInt(formData.get('jobId')),
        customerId: parseInt(formData.get('customerId')),
        amount: parseFloat(formData.get('amount')),
        status: formData.get('status'),
        dueDate: formData.get('dueDate'),
        items: []
    };
    
    try {
        const url = id ? `${API_BASE}/api/invoices/${id}` : `${API_BASE}/api/invoices`;
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        closeModal();
        await loadInvoices();
    } catch (error) {
        console.error('Error saving invoice:', error);
        alert('Fehler beim Speichern!');
    }
}

function editInvoice(id) {
    showInvoiceModal(id);
}

// ==================== MODAL HELPERS ====================

function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-container').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('modal-container')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-container') {
        closeModal();
    }
});

// ==================== UTILITY FUNCTIONS ====================

function getStatusText(status) {
    const statusMap = {
        'available': 'Verfügbar',
        'busy': 'Beschäftigt',
        'pending': 'Ausstehend',
        'in-progress': 'In Bearbeitung',
        'completed': 'Abgeschlossen',
        'cancelled': 'Abgebrochen',
        'scheduled': 'Geplant',
        'paid': 'Bezahlt',
        'overdue': 'Überfällig'
    };
    return statusMap[status] || status;
}

function getPriorityText(priority) {
    const priorityMap = {
        'low': 'Niedrig',
        'medium': 'Mittel',
        'high': 'Hoch'
    };
    return priorityMap[priority] || priority;
}
