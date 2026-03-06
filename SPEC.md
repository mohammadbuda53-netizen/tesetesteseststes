# Handwerker Management App - Spezifikation

## 1. Projektübersicht

- **Projektname**: Handwerker Manager
- **Typ**: Webanwendung (Node.js + Express + SQLite)
- **Kernfunktion**: Verwaltung von Handwerkern, Aufträgen, Kunden und Zeiterfassung
- **Zielgruppe**: Handwerksbetriebe, Bauunternehmen, Dienstleister

## 2. Datenmodell

### Mitarbeiter (Workers)
- id, name, email, phone, specialty, hourlyRate, active

### Kunden (Customers)
- id, name, email, phone, address, company

### Aufträge (Jobs)
- id, customerId, title, description, status, startDate, endDate, price

### Zeiterfassung (TimeEntries)
- id, workerId, jobId, date, hours, description

## 3. Funktionen

### Dashboard
- Übersicht aller aktiven Aufträge
- Aktive Mitarbeiter
- Heutige Zeiteinträge

### Mitarbeiterverwaltung
- CRUD für Mitarbeiter
- Fachgebiet, Stundensatz

### Kundenverwaltung
- CRUD für Kunden

### Auftragsverwaltung
- CRUD für Aufträge
- Status: offen, in Bearbeitung, abgeschlossen, fakturiert

### Zeiterfassung
- Einträge pro Mitarbeiter und Auftrag
- Stundenübersicht

## 4. Tech Stack
- Backend: Express.js + SQLite
- Frontend: HTML/CSS/JS (Vanilla)
- Styling: CSS mit modernem Design
