// Global state
let handwerkerData = [];
let kundenData = [];
let auftrageData = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

// Load all data
async function loadAllData() {
    await Promise.all([
        loadHandwerker(),
        loadKunden(),
        loadAuftrage(),
        loadStatistics()
    ]);
}

// ===== STATISTICS =====
async function loadStatistics() {
    try {
        const response = await fetch('/api/statistics');
        const stats = await response.json();
        
        document.getElementById('stat-handwerker').textContent = stats.totalHandwerker;
        document.getElementById('stat-kunden').textContent = stats.totalKunden;
        document.getElementById('stat-auftrage').textContent = stats.totalAuftrage;
        document.getElementById('stat-offen').textContent = stats.offeneAuftrage;
    } catch (error) {
        console.error('Fehler beim Laden der Statistiken:', error);
    }
}

// ===== TAB NAVIGATION =====
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// ===== HANDWERKER FUNCTIONS =====
async function loadHandwerker() {
    try {
        const response = await fetch('/api/handwerker');
        handwerkerData = await response.json();
        renderHandwerkerList();
        updateAuftrageHandwerkerSelect();
    } catch (error) {
        console.error('Fehler beim Laden der Handwerker:', error);
    }
}

function renderHandwerkerList() {
    const container = document.getElementById('handwerker-list');
    
    if (handwerkerData.length === 0) {
        container.innerHTML = '<p class="empty-message">Keine Handwerker vorhanden. Erstellen Sie einen neuen Handwerker.</p>';
        return;
    }
    
    container.innerHTML = handwerkerData.map(h => `
        <div class="card">
            <div class="card-header">
                <h3>${h.name}</h3>
                <span class="badge">${h.fachgebiet}</span>
            </div>
            <div class="card-body">
                <p><strong>📞 Telefon:</strong> ${h.telefon}</p>
                ${h.email ? `<p><strong>📧 Email:</strong> ${h.email}</p>` : ''}
                ${h.stundensatz ? `<p><strong>💰 Stundensatz:</strong> ${h.stundensatz} €</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-small btn-secondary" onclick="editHandwerker('${h.id}')">Bearbeiten</button>
                <button class="btn btn-small btn-danger" onclick="deleteHandwerker('${h.id}')">Löschen</button>
            </div>
        </div>
    `).join('');
}

function showHandwerkerForm() {
    document.getElementById('handwerker-form').style.display = 'block';
    document.getElementById('handwerker-form-title').textContent = 'Neuer Handwerker';
    document.getElementById('handwerker-form-element').reset();
    document.getElementById('handwerker-id').value = '';
}

function cancelHandwerkerForm() {
    document.getElementById('handwerker-form').style.display = 'none';
    document.getElementById('handwerker-form-element').reset();
}

async function saveHandwerker(event) {
    event.preventDefault();
    
    const id = document.getElementById('handwerker-id').value;
    const data = {
        name: document.getElementById('handwerker-name').value,
        fachgebiet: document.getElementById('handwerker-fachgebiet').value,
        telefon: document.getElementById('handwerker-telefon').value,
        email: document.getElementById('handwerker-email').value,
        stundensatz: document.getElementById('handwerker-stundensatz').value
    };
    
    try {
        const url = id ? `/api/handwerker/${id}` : '/api/handwerker';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            cancelHandwerkerForm();
            await loadAllData();
        }
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern des Handwerkers');
    }
}

function editHandwerker(id) {
    const handwerker = handwerkerData.find(h => h.id === id);
    if (!handwerker) return;
    
    document.getElementById('handwerker-id').value = handwerker.id;
    document.getElementById('handwerker-name').value = handwerker.name;
    document.getElementById('handwerker-fachgebiet').value = handwerker.fachgebiet;
    document.getElementById('handwerker-telefon').value = handwerker.telefon;
    document.getElementById('handwerker-email').value = handwerker.email || '';
    document.getElementById('handwerker-stundensatz').value = handwerker.stundensatz || '';
    
    document.getElementById('handwerker-form-title').textContent = 'Handwerker bearbeiten';
    document.getElementById('handwerker-form').style.display = 'block';
}

async function deleteHandwerker(id) {
    if (!confirm('Möchten Sie diesen Handwerker wirklich löschen?')) return;
    
    try {
        const response = await fetch(`/api/handwerker/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadAllData();
        }
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Fehler beim Löschen des Handwerkers');
    }
}

// ===== KUNDEN FUNCTIONS =====
async function loadKunden() {
    try {
        const response = await fetch('/api/kunden');
        kundenData = await response.json();
        renderKundenList();
        updateAuftrageKundenSelect();
    } catch (error) {
        console.error('Fehler beim Laden der Kunden:', error);
    }
}

function renderKundenList() {
    const container = document.getElementById('kunden-list');
    
    if (kundenData.length === 0) {
        container.innerHTML = '<p class="empty-message">Keine Kunden vorhanden. Erstellen Sie einen neuen Kunden.</p>';
        return;
    }
    
    container.innerHTML = kundenData.map(k => `
        <div class="card">
            <div class="card-header">
                <h3>${k.name}</h3>
            </div>
            <div class="card-body">
                <p><strong>📍 Adresse:</strong> ${k.adresse}</p>
                <p><strong>📞 Telefon:</strong> ${k.telefon}</p>
                ${k.email ? `<p><strong>📧 Email:</strong> ${k.email}</p>` : ''}
                ${k.notizen ? `<p><strong>📝 Notizen:</strong> ${k.notizen}</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-small btn-secondary" onclick="editKunde('${k.id}')">Bearbeiten</button>
                <button class="btn btn-small btn-danger" onclick="deleteKunde('${k.id}')">Löschen</button>
            </div>
        </div>
    `).join('');
}

function showKundenForm() {
    document.getElementById('kunden-form').style.display = 'block';
    document.getElementById('kunden-form-title').textContent = 'Neuer Kunde';
    document.getElementById('kunden-form-element').reset();
    document.getElementById('kunden-id').value = '';
}

function cancelKundenForm() {
    document.getElementById('kunden-form').style.display = 'none';
    document.getElementById('kunden-form-element').reset();
}

async function saveKunde(event) {
    event.preventDefault();
    
    const id = document.getElementById('kunden-id').value;
    const data = {
        name: document.getElementById('kunden-name').value,
        adresse: document.getElementById('kunden-adresse').value,
        telefon: document.getElementById('kunden-telefon').value,
        email: document.getElementById('kunden-email').value,
        notizen: document.getElementById('kunden-notizen').value
    };
    
    try {
        const url = id ? `/api/kunden/${id}` : '/api/kunden';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            cancelKundenForm();
            await loadAllData();
        }
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern des Kunden');
    }
}

function editKunde(id) {
    const kunde = kundenData.find(k => k.id === id);
    if (!kunde) return;
    
    document.getElementById('kunden-id').value = kunde.id;
    document.getElementById('kunden-name').value = kunde.name;
    document.getElementById('kunden-adresse').value = kunde.adresse;
    document.getElementById('kunden-telefon').value = kunde.telefon;
    document.getElementById('kunden-email').value = kunde.email || '';
    document.getElementById('kunden-notizen').value = kunde.notizen || '';
    
    document.getElementById('kunden-form-title').textContent = 'Kunde bearbeiten';
    document.getElementById('kunden-form').style.display = 'block';
}

async function deleteKunde(id) {
    if (!confirm('Möchten Sie diesen Kunden wirklich löschen?')) return;
    
    try {
        const response = await fetch(`/api/kunden/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadAllData();
        }
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Fehler beim Löschen des Kunden');
    }
}

// ===== AUFTRÄGE FUNCTIONS =====
async function loadAuftrage() {
    try {
        const response = await fetch('/api/auftrage');
        auftrageData = await response.json();
        renderAuftrageList();
    } catch (error) {
        console.error('Fehler beim Laden der Aufträge:', error);
    }
}

function renderAuftrageList() {
    const container = document.getElementById('auftrage-list');
    
    if (auftrageData.length === 0) {
        container.innerHTML = '<p class="empty-message">Keine Aufträge vorhanden. Erstellen Sie einen neuen Auftrag.</p>';
        return;
    }
    
    container.innerHTML = auftrageData.map(a => {
        const kunde = kundenData.find(k => k.id === a.kundeId);
        const handwerker = handwerkerData.find(h => h.id === a.handwerkerId);
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3>${a.titel}</h3>
                    <span class="badge badge-${getStatusClass(a.status)}">${a.status}</span>
                </div>
                <div class="card-body">
                    <p><strong>📝 Beschreibung:</strong> ${a.beschreibung}</p>
                    <p><strong>👤 Kunde:</strong> ${kunde ? kunde.name : 'Unbekannt'}</p>
                    <p><strong>👷 Handwerker:</strong> ${handwerker ? handwerker.name : 'Unbekannt'}</p>
                    ${a.startdatum ? `<p><strong>📅 Start:</strong> ${formatDate(a.startdatum)}</p>` : ''}
                    ${a.enddatum ? `<p><strong>📅 Ende:</strong> ${formatDate(a.enddatum)}</p>` : ''}
                    ${a.kosten ? `<p><strong>💰 Kosten:</strong> ${a.kosten} €</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-small btn-secondary" onclick="editAuftrag('${a.id}')">Bearbeiten</button>
                    <button class="btn btn-small btn-danger" onclick="deleteAuftrag('${a.id}')">Löschen</button>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusClass(status) {
    switch(status) {
        case 'Offen': return 'warning';
        case 'In Bearbeitung': return 'info';
        case 'Abgeschlossen': return 'success';
        default: return '';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
}

function showAuftrageForm() {
    updateAuftrageKundenSelect();
    updateAuftrageHandwerkerSelect();
    document.getElementById('auftrage-form').style.display = 'block';
    document.getElementById('auftrage-form-title').textContent = 'Neuer Auftrag';
    document.getElementById('auftrage-form-element').reset();
    document.getElementById('auftrage-id').value = '';
}

function cancelAuftrageForm() {
    document.getElementById('auftrage-form').style.display = 'none';
    document.getElementById('auftrage-form-element').reset();
}

function updateAuftrageKundenSelect() {
    const select = document.getElementById('auftrage-kunde');
    select.innerHTML = '<option value="">Bitte wählen...</option>' +
        kundenData.map(k => `<option value="${k.id}">${k.name}</option>`).join('');
}

function updateAuftrageHandwerkerSelect() {
    const select = document.getElementById('auftrage-handwerker');
    select.innerHTML = '<option value="">Bitte wählen...</option>' +
        handwerkerData.map(h => `<option value="${h.id}">${h.name} (${h.fachgebiet})</option>`).join('');
}

async function saveAuftrag(event) {
    event.preventDefault();
    
    const id = document.getElementById('auftrage-id').value;
    const data = {
        titel: document.getElementById('auftrage-titel').value,
        beschreibung: document.getElementById('auftrage-beschreibung').value,
        kundeId: document.getElementById('auftrage-kunde').value,
        handwerkerId: document.getElementById('auftrage-handwerker').value,
        status: document.getElementById('auftrage-status').value,
        startdatum: document.getElementById('auftrage-startdatum').value,
        enddatum: document.getElementById('auftrage-enddatum').value,
        kosten: document.getElementById('auftrage-kosten').value
    };
    
    try {
        const url = id ? `/api/auftrage/${id}` : '/api/auftrage';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            cancelAuftrageForm();
            await loadAllData();
        }
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern des Auftrags');
    }
}

function editAuftrag(id) {
    const auftrag = auftrageData.find(a => a.id === id);
    if (!auftrag) return;
    
    updateAuftrageKundenSelect();
    updateAuftrageHandwerkerSelect();
    
    document.getElementById('auftrage-id').value = auftrag.id;
    document.getElementById('auftrage-titel').value = auftrag.titel;
    document.getElementById('auftrage-beschreibung').value = auftrag.beschreibung;
    document.getElementById('auftrage-kunde').value = auftrag.kundeId;
    document.getElementById('auftrage-handwerker').value = auftrag.handwerkerId;
    document.getElementById('auftrage-status').value = auftrag.status;
    document.getElementById('auftrage-startdatum').value = auftrag.startdatum || '';
    document.getElementById('auftrage-enddatum').value = auftrag.enddatum || '';
    document.getElementById('auftrage-kosten').value = auftrag.kosten || '';
    
    document.getElementById('auftrage-form-title').textContent = 'Auftrag bearbeiten';
    document.getElementById('auftrage-form').style.display = 'block';
}

async function deleteAuftrag(id) {
    if (!confirm('Möchten Sie diesen Auftrag wirklich löschen?')) return;
    
    try {
        const response = await fetch(`/api/auftrage/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await loadAllData();
        }
    } catch (error) {
        console.error('Fehler beim Löschen:', error);
        alert('Fehler beim Löschen des Auftrags');
    }
}
