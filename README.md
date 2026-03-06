# 🔧 Handwerker Management App

Eine vollständige Verwaltungsanwendung für Handwerker, Kunden und Aufträge.

## Features

### 📊 Dashboard
- Übersicht über alle Handwerker, Kunden und Aufträge
- Statistiken zu offenen, in Bearbeitung befindlichen und abgeschlossenen Aufträgen
- Echtzeit-Updates

### 👷 Handwerker Verwaltung
- Handwerker anlegen, bearbeiten und löschen
- Fachgebiete: Elektriker, Klempner, Maler, Schreiner, Maurer, Dachdecker, Heizungsbauer, Fliesenleger
- Kontaktdaten (Telefon, Email)
- Stundensatz-Verwaltung

### 👥 Kunden Verwaltung
- Kunden anlegen, bearbeiten und löschen
- Adressverwaltung
- Kontaktdaten
- Notizen zu Kunden

### 📋 Aufträge Verwaltung
- Aufträge erstellen und verwalten
- Zuordnung zu Handwerkern und Kunden
- Status-Tracking (Offen, In Bearbeitung, Abgeschlossen)
- Datum- und Kostenverwaltung
- Detaillierte Beschreibungen

## Technologie-Stack

- **Backend**: Node.js mit Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Datenspeicherung**: JSON-basierte Persistenz
- **Design**: Modernes, responsives UI

## Installation

1. Abhängigkeiten installieren:
```bash
npm install
```

2. Server starten:
```bash
npm start
```

3. Browser öffnen:
```
http://localhost:3000
```

## Verwendung

### Handwerker hinzufügen
1. Navigieren Sie zum Tab "Handwerker"
2. Klicken Sie auf "+ Neuer Handwerker"
3. Füllen Sie das Formular aus
4. Klicken Sie auf "Speichern"

### Kunden hinzufügen
1. Navigieren Sie zum Tab "Kunden"
2. Klicken Sie auf "+ Neuer Kunde"
3. Füllen Sie das Formular aus
4. Klicken Sie auf "Speichern"

### Auftrag erstellen
1. Navigieren Sie zum Tab "Aufträge"
2. Klicken Sie auf "+ Neuer Auftrag"
3. Wählen Sie einen Kunden und Handwerker aus
4. Füllen Sie die Auftragsdetails aus
5. Klicken Sie auf "Speichern"

## API Endpunkte

### Handwerker
- `GET /api/handwerker` - Alle Handwerker abrufen
- `GET /api/handwerker/:id` - Einzelnen Handwerker abrufen
- `POST /api/handwerker` - Neuen Handwerker erstellen
- `PUT /api/handwerker/:id` - Handwerker aktualisieren
- `DELETE /api/handwerker/:id` - Handwerker löschen

### Kunden
- `GET /api/kunden` - Alle Kunden abrufen
- `GET /api/kunden/:id` - Einzelnen Kunden abrufen
- `POST /api/kunden` - Neuen Kunden erstellen
- `PUT /api/kunden/:id` - Kunden aktualisieren
- `DELETE /api/kunden/:id` - Kunden löschen

### Aufträge
- `GET /api/auftrage` - Alle Aufträge abrufen
- `GET /api/auftrage/:id` - Einzelnen Auftrag abrufen
- `POST /api/auftrage` - Neuen Auftrag erstellen
- `PUT /api/auftrage/:id` - Auftrag aktualisieren
- `DELETE /api/auftrage/:id` - Auftrag löschen

### Statistiken
- `GET /api/statistics` - Dashboard-Statistiken abrufen

## Datenspeicherung

Die Daten werden in der Datei `data.json` gespeichert und bleiben nach einem Neustart erhalten.

## Projektstruktur

```
/vercel/sandbox/
├── server.js           # Express Backend Server
├── package.json        # Projekt-Konfiguration
├── data.json          # Datenspeicher (wird automatisch erstellt)
├── public/
│   ├── index.html     # Haupt-HTML-Datei
│   ├── app.js         # Frontend JavaScript
│   └── styles.css     # Styling
└── README.md          # Diese Datei
```

## Features im Detail

### Responsive Design
- Optimiert für Desktop, Tablet und Mobile
- Moderne UI mit Animationen
- Intuitive Benutzerführung

### Datenpersistenz
- Automatisches Speichern aller Änderungen
- JSON-basierte Datenhaltung
- Keine Datenbank erforderlich

### Benutzerfreundlichkeit
- Einfache Navigation mit Tabs
- Bestätigungsdialoge für Löschvorgänge
- Inline-Bearbeitung
- Visuelle Feedback-Elemente

## Lizenz

MIT
