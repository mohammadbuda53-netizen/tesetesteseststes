# 🔧 Handwerker Management App

Eine moderne Web-Anwendung zur Verwaltung von Handwerkern, Kunden und Aufträgen.

## ✨ Features

### 📊 Dashboard
- Übersicht über alle wichtigen Kennzahlen
- Anzahl der Handwerker, Kunden und Aufträge
- Gesamtumsatz-Anzeige
- Aktuelle Aufträge auf einen Blick

### 👷 Handwerker-Verwaltung
- Handwerker hinzufügen, bearbeiten und löschen
- Erfassung von:
  - Name und Kontaktdaten
  - Fachgebiet (Elektriker, Klempner, Maler, etc.)
  - Stundensatz
  - Verfügbarkeitsstatus
- Übersichtliche Kartendarstellung

### 👥 Kunden-Verwaltung
- Kundendaten verwalten
- Erfassung von:
  - Kontaktinformationen
  - Vollständige Adresse
  - Telefon und Email
- Schnelle Suche und Filterung

### 📋 Auftrags-Verwaltung
- Aufträge erstellen und verwalten
- Zuweisung von Handwerkern zu Aufträgen
- Status-Tracking:
  - Offen
  - In Bearbeitung
  - Abgeschlossen
  - Storniert
- Prioritätsstufen (Niedrig, Mittel, Hoch)
- Kosten- und Terminverwaltung

## 🚀 Tech Stack

- **Frontend**: React 18, Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Sprache**: TypeScript
- **API**: Next.js API Routes
- **Datenspeicherung**: In-Memory (für Entwicklung)

## 📦 Installation

1. **Abhängigkeiten installieren:**
```bash
npm install
```

2. **Entwicklungsserver starten:**
```bash
npm run dev
```

3. **App öffnen:**
Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

## 🏗️ Projektstruktur

```
handwerker-app/
├── app/
│   ├── api/
│   │   ├── handwerker/      # Handwerker API Routes
│   │   ├── kunden/          # Kunden API Routes
│   │   └── auftraege/       # Auftrags API Routes
│   ├── layout.tsx           # Root Layout
│   ├── page.tsx             # Hauptseite mit Dashboard
│   └── globals.css          # Globale Styles
├── components/
│   ├── HandwerkerForm.tsx   # Formular für Handwerker
│   ├── KundenForm.tsx       # Formular für Kunden
│   └── AuftragForm.tsx      # Formular für Aufträge
├── lib/
│   └── db.ts                # In-Memory Datenbank
├── types/
│   └── index.ts             # TypeScript Typdefinitionen
└── README.md
```

## 🔄 API Endpoints

### Handwerker
- `GET /api/handwerker` - Alle Handwerker abrufen
- `POST /api/handwerker` - Neuen Handwerker erstellen
- `PUT /api/handwerker` - Handwerker aktualisieren
- `DELETE /api/handwerker?id={id}` - Handwerker löschen

### Kunden
- `GET /api/kunden` - Alle Kunden abrufen
- `POST /api/kunden` - Neuen Kunden erstellen
- `PUT /api/kunden` - Kunde aktualisieren
- `DELETE /api/kunden?id={id}` - Kunde löschen

### Aufträge
- `GET /api/auftraege` - Alle Aufträge abrufen
- `POST /api/auftraege` - Neuen Auftrag erstellen
- `PUT /api/auftraege` - Auftrag aktualisieren
- `DELETE /api/auftraege?id={id}` - Auftrag löschen

## 💾 Datenmodelle

### Handwerker
```typescript
{
  id: string;
  name: string;
  vorname: string;
  fachgebiet: string;
  telefon: string;
  email: string;
  stundensatz: number;
  verfuegbar: boolean;
  erstellt: string;
}
```

### Kunde
```typescript
{
  id: string;
  name: string;
  vorname: string;
  adresse: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  erstellt: string;
}
```

### Auftrag
```typescript
{
  id: string;
  kundeId: string;
  handwerkerId: string;
  titel: string;
  beschreibung: string;
  status: 'offen' | 'in_bearbeitung' | 'abgeschlossen' | 'storniert';
  prioritaet: 'niedrig' | 'mittel' | 'hoch';
  startDatum: string;
  endDatum?: string;
  kosten: number;
  erstellt: string;
}
```

## 🎨 Features im Detail

### Responsive Design
- Optimiert für Desktop, Tablet und Mobile
- Grid-Layout passt sich automatisch an
- Touch-optimierte Bedienelemente

### Benutzerfreundlichkeit
- Intuitive Navigation zwischen Bereichen
- Inline-Formulare für schnelles Bearbeiten
- Bestätigungsdialoge für kritische Aktionen
- Farbcodierte Status und Prioritäten

### Datenvisualisierung
- Dashboard mit KPI-Karten
- Statusanzeigen mit Farben
- Übersichtliche Listen und Karten

## 🔮 Erweiterungsmöglichkeiten

- **Echte Datenbank**: PostgreSQL, MongoDB oder MySQL integrieren
- **Authentifizierung**: Benutzer-Login und Rechteverwaltung
- **Kalenderansicht**: Terminplanung visualisieren
- **Reporting**: PDF-Berichte und Rechnungen generieren
- **Benachrichtigungen**: Email/SMS-Erinnerungen
- **Bildupload**: Fotos von Aufträgen hochladen
- **Zeiterfassung**: Arbeitsstunden tracking
- **Mobile App**: React Native Version

## 📝 Entwicklung

### Build für Produktion
```bash
npm run build
```

### Produktionsserver starten
```bash
npm start
```

### Linting
```bash
npm run lint
```

## 📄 Lizenz

Dieses Projekt ist für Demonstrationszwecke erstellt.

## 👨‍💻 Entwickler

Erstellt mit Next.js, React und TypeScript.

---

**Hinweis**: Die aktuelle Version verwendet einen In-Memory-Speicher. Daten gehen beim Neustart verloren. Für den Produktionseinsatz sollte eine persistente Datenbank integriert werden.
