# Handwerker Management App

Eine professionelle Verwaltungssoftware für Handwerkerbetriebe.

## Features

- **Kundenverwaltung**: Verwalten Sie alle Ihre Kunden mit Kontaktdaten und Notizen
- **Auftragsverwaltung**: Erstellen und verfolgen Sie Aufträge mit Status, Priorität und Kosten
- **Terminplanung**: Planen Sie Termine mit Kunden und verknüpfen Sie diese mit Aufträgen
- **Rechnungserstellung**: Erstellen Sie professionelle Rechnungen mit automatischer MwSt-Berechnung
- **Dashboard**: Übersichtliches Dashboard mit wichtigen Kennzahlen und aktuellen Informationen

## Technologie-Stack

- **Framework**: Next.js 15 mit TypeScript
- **UI**: React Bootstrap mit Material Design Prinzipien
- **Datenspeicherung**: LocalStorage (Browser)
- **Styling**: Bootstrap 5 + Custom CSS

## Installation

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Entwicklung

```bash
# Entwicklungsserver starten
npm run dev

# Production Build erstellen
npm run build

# Production Server starten
npm start

# Linting
npm run lint
```

## Projektstruktur

```
handwerker-app/
├── app/
│   ├── components/      # Wiederverwendbare Komponenten
│   ├── lib/            # Typen und Hilfsfunktionen
│   ├── customers/      # Kundenverwaltung
│   ├── jobs/           # Auftragsverwaltung
│   ├── appointments/   # Terminplanung
│   ├── invoices/       # Rechnungsverwaltung
│   ├── layout.tsx      # Hauptlayout
│   ├── page.tsx        # Dashboard
│   └── globals.css     # Globale Styles
├── public/             # Statische Assets
└── package.json        # Projekt-Konfiguration
```

## Funktionen im Detail

### Kundenverwaltung
- Kunden anlegen, bearbeiten und löschen
- Kontaktinformationen speichern
- Notizen zu Kunden hinzufügen

### Auftragsverwaltung
- Aufträge erstellen und verwalten
- Status-Tracking (Offen, In Bearbeitung, Abgeschlossen, Storniert)
- Prioritätsstufen (Niedrig, Mittel, Hoch)
- Kosten-Kalkulation (geschätzt und tatsächlich)

### Terminplanung
- Termine mit Datum und Uhrzeit planen
- Termine mit Kunden und Aufträgen verknüpfen
- Status-Verwaltung für Termine

### Rechnungserstellung
- Professionelle Rechnungen erstellen
- Automatische Rechnungsnummerierung
- Mehrere Positionen pro Rechnung
- Automatische MwSt-Berechnung (19%)
- Status-Tracking (Entwurf, Gesendet, Bezahlt, Überfällig)

### Dashboard
- Übersicht über wichtige Kennzahlen
- Anstehende Termine
- Aktuelle Aufträge
- Offene Rechnungen
- Monatlicher Umsatz

## Lizenz

ISC
