# 🔧 Handwerker Management App

Eine umfassende Webanwendung zur Verwaltung von Handwerkern, Kunden, Aufträgen, Terminen und Rechnungen.

## ✨ Features

- **👷 Handwerker-Verwaltung**: Verwalten Sie Ihre Handwerker mit Fachgebieten, Kontaktdaten und Stundensätzen
- **👥 Kunden-Verwaltung**: Speichern Sie Kundendaten, Adressen und Notizen
- **📋 Auftrags-Verwaltung**: Erstellen und verfolgen Sie Aufträge mit Status, Priorität und Zeiterfassung
- **📅 Termin-Planung**: Planen Sie Termine mit Handwerkern und Kunden
- **💶 Rechnungs-Management**: Erstellen und verwalten Sie Rechnungen mit Status-Tracking
- **📊 Dashboard**: Übersichtliche Statistiken und aktuelle Informationen auf einen Blick

## 🚀 Installation

### Voraussetzungen

- Node.js (v14 oder höher)
- npm (normalerweise mit Node.js installiert)

### Setup

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **Server starten:**
   ```bash
   npm start
   ```

3. **Anwendung öffnen:**
   
   Öffnen Sie Ihren Browser und navigieren Sie zu: `http://localhost:3000`

## 📁 Projektstruktur

```
handwerker-management-app/
├── server.js              # Express Backend-Server mit REST API
├── package.json           # Projekt-Konfiguration und Abhängigkeiten
├── public/                # Frontend-Dateien
│   ├── index.html        # Haupt-HTML-Datei
│   ├── styles.css        # Styling
│   └── app.js            # Frontend-Logik
└── README.md             # Dokumentation
```

## 🔌 API Endpunkte

### Handwerker (Craftsmen)

- `GET /api/craftsmen` - Alle Handwerker abrufen
- `GET /api/craftsmen/:id` - Einzelnen Handwerker abrufen
- `POST /api/craftsmen` - Neuen Handwerker erstellen
- `PUT /api/craftsmen/:id` - Handwerker aktualisieren
- `DELETE /api/craftsmen/:id` - Handwerker löschen

**Beispiel Request Body:**
```json
{
  "name": "Max Mustermann",
  "specialty": "Elektriker",
  "phone": "+49 123 456789",
  "email": "max@beispiel.de",
  "hourlyRate": 65.00,
  "status": "available"
}
```

### Kunden (Customers)

- `GET /api/customers` - Alle Kunden abrufen
- `GET /api/customers/:id` - Einzelnen Kunden abrufen
- `POST /api/customers` - Neuen Kunden erstellen
- `PUT /api/customers/:id` - Kunden aktualisieren
- `DELETE /api/customers/:id` - Kunden löschen

**Beispiel Request Body:**
```json
{
  "name": "Erika Musterfrau",
  "address": "Musterstraße 123, 12345 Berlin",
  "phone": "+49 987 654321",
  "email": "erika@beispiel.de",
  "notes": "Wichtige Notizen zum Kunden"
}
```

### Aufträge (Jobs)

- `GET /api/jobs` - Alle Aufträge abrufen
- `GET /api/jobs/:id` - Einzelnen Auftrag abrufen
- `POST /api/jobs` - Neuen Auftrag erstellen
- `PUT /api/jobs/:id` - Auftrag aktualisieren
- `DELETE /api/jobs/:id` - Auftrag löschen

**Beispiel Request Body:**
```json
{
  "title": "Elektroinstallation Neubau",
  "description": "Installation der kompletten Elektrik",
  "customerId": 1,
  "craftsmanId": 1,
  "status": "pending",
  "priority": "high",
  "estimatedHours": 40,
  "actualHours": 0,
  "scheduledDate": "2026-03-15"
}
```

### Termine (Appointments)

- `GET /api/appointments` - Alle Termine abrufen
- `POST /api/appointments` - Neuen Termin erstellen
- `PUT /api/appointments/:id` - Termin aktualisieren
- `DELETE /api/appointments/:id` - Termin löschen

**Beispiel Request Body:**
```json
{
  "jobId": 1,
  "customerId": 1,
  "craftsmanId": 1,
  "date": "2026-03-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "status": "scheduled",
  "notes": "Zugang über Hintereingang"
}
```

### Rechnungen (Invoices)

- `GET /api/invoices` - Alle Rechnungen abrufen
- `POST /api/invoices` - Neue Rechnung erstellen
- `PUT /api/invoices/:id` - Rechnung aktualisieren

**Beispiel Request Body:**
```json
{
  "jobId": 1,
  "customerId": 1,
  "amount": 2600.00,
  "status": "pending",
  "dueDate": "2026-04-15",
  "items": []
}
```

### Dashboard Statistiken

- `GET /api/stats` - Dashboard-Statistiken abrufen

**Beispiel Response:**
```json
{
  "totalCraftsmen": 5,
  "availableCraftsmen": 3,
  "totalJobs": 12,
  "activeJobs": 4,
  "pendingJobs": 3,
  "completedJobs": 5,
  "totalCustomers": 8,
  "upcomingAppointments": 6,
  "pendingInvoices": 4,
  "totalRevenue": 15600.00
}
```

## 💡 Verwendung

### Dashboard
Das Dashboard bietet eine Übersicht über:
- Gesamtanzahl und Status der Handwerker
- Aktive und ausstehende Aufträge
- Kundenanzahl
- Kommende Termine
- Rechnungsstatus

### Handwerker verwalten
1. Klicken Sie auf den Tab "Handwerker"
2. Klicken Sie auf "+ Neuer Handwerker"
3. Füllen Sie das Formular aus
4. Klicken Sie auf "Speichern"

### Aufträge erstellen
1. Navigieren Sie zum Tab "Aufträge"
2. Klicken Sie auf "+ Neuer Auftrag"
3. Wählen Sie Kunde und Handwerker aus
4. Geben Sie Details ein (Titel, Beschreibung, Stunden, etc.)
5. Speichern Sie den Auftrag

### Termine planen
1. Gehen Sie zum Tab "Termine"
2. Klicken Sie auf "+ Neuer Termin"
3. Wählen Sie Auftrag, Kunde und Handwerker
4. Legen Sie Datum und Zeit fest
5. Speichern Sie den Termin

## 🎨 Technologie-Stack

- **Backend**: Node.js mit Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Datenspeicherung**: In-Memory (für Demonstration)
- **API**: RESTful API
- **Design**: Responsive Design mit modernem UI

## 📝 Status-Werte

### Handwerker Status
- `available` - Verfügbar
- `busy` - Beschäftigt

### Auftrags-Status
- `pending` - Ausstehend
- `in-progress` - In Bearbeitung
- `completed` - Abgeschlossen
- `cancelled` - Abgebrochen

### Termin-Status
- `scheduled` - Geplant
- `completed` - Abgeschlossen
- `cancelled` - Abgebrochen

### Rechnungs-Status
- `pending` - Ausstehend
- `paid` - Bezahlt
- `overdue` - Überfällig

### Prioritäten
- `low` - Niedrig
- `medium` - Mittel
- `high` - Hoch

## 🔄 Zukünftige Erweiterungen

- [ ] Persistente Datenbank (z.B. PostgreSQL, MongoDB)
- [ ] Benutzer-Authentifizierung und -Autorisierung
- [ ] Kalender-Ansicht für Termine
- [ ] PDF-Export für Rechnungen
- [ ] E-Mail-Benachrichtigungen
- [ ] Mobil-App
- [ ] Reporting und Analytics
- [ ] Datei-Upload für Dokumente
- [ ] Multi-Mandanten-Fähigkeit

## 🛠️ Entwicklung

### Entwicklungsserver starten
```bash
npm run dev
```

### Port ändern
Der Server läuft standardmäßig auf Port 3000. Um einen anderen Port zu verwenden:
```bash
PORT=8080 npm start
```

## 📄 Lizenz

MIT License

## 👨‍💻 Autor

Erstellt mit Factory AI Droid

## 🤝 Mitwirkung

Beiträge, Issues und Feature-Requests sind willkommen!

## 📧 Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.