# Handwerker Management App

Eine vollständige Verwaltungsanwendung für Handwerksbetriebe zur Verwaltung von Handwerkern, Kunden und Aufträgen.

## Features

- **Handwerker-Verwaltung**: Verwalten Sie Ihre Handwerker mit Gewerken, Kontaktdaten und Stundensätzen
- **Kunden-Verwaltung**: Kundendatenbank mit Kontaktinformationen
- **Auftrags-Verwaltung**: Erstellen und verfolgen Sie Aufträge mit Status, Priorität und Kosten
- **Dashboard**: Übersicht über alle wichtigen Kennzahlen
- **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten

## Technologie-Stack

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- REST API

**Frontend:**
- React 18
- Axios für API-Calls
- Modernes CSS mit Gradients

## Installation

### Voraussetzungen
- Node.js 14+ installiert

### Schritt 1: Abhängigkeiten installieren

```bash
# Backend-Abhängigkeiten
npm install

# Frontend-Abhängigkeiten
cd client
npm install
cd ..
```

Oder verwenden Sie den Shortcut:
```bash
npm run install-all
```

### Schritt 2: Server starten

```bash
# Backend-Server (Port 3001)
npm start

# In einem neuen Terminal: Frontend-Server (Port 3000)
npm run client
```

### Schritt 3: Anwendung öffnen

Öffnen Sie Ihren Browser und navigieren Sie zu:
```
http://localhost:3000
```

Die API ist verfügbar unter:
```
http://localhost:3001/api
```

## API-Endpunkte

### Handwerker
- `GET /api/craftsmen` - Alle Handwerker abrufen
- `GET /api/craftsmen/:id` - Einzelnen Handwerker abrufen
- `POST /api/craftsmen` - Neuen Handwerker erstellen
- `PUT /api/craftsmen/:id` - Handwerker aktualisieren
- `DELETE /api/craftsmen/:id` - Handwerker löschen

### Kunden
- `GET /api/customers` - Alle Kunden abrufen
- `GET /api/customers/:id` - Einzelnen Kunden abrufen
- `POST /api/customers` - Neuen Kunden erstellen
- `PUT /api/customers/:id` - Kunden aktualisieren
- `DELETE /api/customers/:id` - Kunden löschen

### Aufträge
- `GET /api/jobs` - Alle Aufträge abrufen
- `GET /api/jobs/:id` - Einzelnen Auftrag abrufen
- `POST /api/jobs` - Neuen Auftrag erstellen
- `PUT /api/jobs/:id` - Auftrag aktualisieren
- `DELETE /api/jobs/:id` - Auftrag löschen

## Datenbank

Die Anwendung verwendet SQLite als Datenbank. Die Datenbankdatei wird automatisch beim ersten Start erstellt:
```
server/handwerker.db
```

### Datenbank-Schema

**craftsmen** (Handwerker)
- id, name, trade, phone, email, hourly_rate, status, created_at

**customers** (Kunden)
- id, name, address, phone, email, created_at

**jobs** (Aufträge)
- id, title, description, customer_id, craftsman_id, status, priority, start_date, end_date, estimated_hours, actual_hours, total_cost, created_at

## Entwicklung

```bash
# Backend mit Auto-Reload
npm run dev

# Frontend Development Server
cd client && npm start
```

## Lizenz

MIT