# 📘 Schnellstart-Anleitung

## Schritt 1: Installation

```bash
npm install
```

## Schritt 2: Server starten

```bash
npm start
```

Die Anwendung läuft jetzt auf: **http://localhost:3000**

## Schritt 3: Erste Schritte

### 1. Handwerker hinzufügen

1. Klicken Sie auf den Tab "👷 Handwerker"
2. Klicken Sie auf "+ Neuer Handwerker"
3. Füllen Sie die Informationen aus:
   - **Name**: z.B. "Hans Müller"
   - **Fachgebiet**: z.B. "Elektriker"
   - **Telefon**: z.B. "+49 123 456789"
   - **E-Mail**: z.B. "hans@beispiel.de"
   - **Stundensatz**: z.B. "65"
   - **Status**: "Verfügbar"
4. Klicken Sie auf "Speichern"

### 2. Kunden hinzufügen

1. Klicken Sie auf den Tab "👥 Kunden"
2. Klicken Sie auf "+ Neuer Kunde"
3. Geben Sie die Kundendaten ein:
   - **Name**: z.B. "Firma Schmidt GmbH"
   - **Adresse**: z.B. "Hauptstraße 45, 10115 Berlin"
   - **Telefon**: z.B. "+49 30 12345678"
   - **E-Mail**: z.B. "info@schmidt.de"
   - **Notizen**: Optional
4. Klicken Sie auf "Speichern"

### 3. Auftrag erstellen

1. Klicken Sie auf den Tab "📋 Aufträge"
2. Klicken Sie auf "+ Neuer Auftrag"
3. Füllen Sie die Auftragsdaten aus:
   - **Titel**: z.B. "Elektroinstallation Büro"
   - **Beschreibung**: z.B. "Installation von 20 Steckdosen und Beleuchtung"
   - **Kunde**: Wählen Sie einen Kunden aus der Liste
   - **Handwerker**: Wählen Sie einen Handwerker aus
   - **Status**: z.B. "Ausstehend"
   - **Priorität**: z.B. "Hoch"
   - **Geplante Stunden**: z.B. "16"
   - **Geplantes Datum**: Wählen Sie ein Datum
4. Klicken Sie auf "Speichern"

### 4. Termin planen

1. Klicken Sie auf den Tab "📅 Termine"
2. Klicken Sie auf "+ Neuer Termin"
3. Geben Sie die Termininformationen ein:
   - **Auftrag**: Wählen Sie einen Auftrag
   - **Kunde**: Wählen Sie den Kunden
   - **Handwerker**: Wählen Sie den Handwerker
   - **Datum**: Wählen Sie das Datum
   - **Startzeit**: z.B. "08:00"
   - **Endzeit**: z.B. "16:00"
   - **Status**: "Geplant"
   - **Notizen**: Optional
4. Klicken Sie auf "Speichern"

### 5. Rechnung erstellen

1. Klicken Sie auf den Tab "💶 Rechnungen"
2. Klicken Sie auf "+ Neue Rechnung"
3. Füllen Sie die Rechnungsinformationen aus:
   - **Auftrag**: Wählen Sie einen abgeschlossenen Auftrag
   - **Kunde**: Wählen Sie den Kunden
   - **Betrag**: z.B. "1040.00" (16 Stunden × 65€)
   - **Status**: "Ausstehend"
   - **Fälligkeitsdatum**: Wählen Sie ein Datum
4. Klicken Sie auf "Speichern"

### 6. Dashboard ansehen

Klicken Sie auf "📊 Dashboard" um eine Übersicht zu sehen:
- Anzahl der Handwerker
- Aktive Aufträge
- Kommende Termine
- Rechnungsstatus

## ⚡ Tipps

- **Bearbeiten**: Klicken Sie auf "✏️ Bearbeiten" um Einträge zu ändern
- **Löschen**: Klicken Sie auf "🗑️ Löschen" um Einträge zu entfernen
- **Status-Updates**: Aktualisieren Sie den Status von Aufträgen während Sie daran arbeiten
- **Dashboard**: Nutzen Sie das Dashboard für einen schnellen Überblick

## 🔍 Beispiel-Workflow

1. **Kundenanfrage** → Kunde im System anlegen
2. **Auftrag erstellen** → Auftrag mit Details erfassen
3. **Handwerker zuweisen** → Verfügbaren Handwerker auswählen
4. **Termin planen** → Termin für die Ausführung festlegen
5. **Auftrag durchführen** → Status auf "In Bearbeitung" setzen
6. **Abschluss** → Status auf "Abgeschlossen" setzen, Stunden erfassen
7. **Rechnung erstellen** → Rechnung basierend auf Stunden erstellen
8. **Zahlung verfolgen** → Rechnungsstatus aktualisieren

## 💾 Daten-Hinweis

**Wichtig**: Diese Demo-Version speichert alle Daten nur im Arbeitsspeicher. Beim Neustart des Servers gehen alle Daten verloren. Für den Produktiveinsatz sollte eine persistente Datenbank verwendet werden.

## 🆘 Problembehebung

### Server startet nicht
```bash
# Port bereits in Verwendung? Versuchen Sie:
PORT=3001 npm start
```

### Browser zeigt nichts an
- Überprüfen Sie, ob der Server läuft
- Öffnen Sie http://localhost:3000 im Browser
- Prüfen Sie die Browser-Konsole auf Fehler (F12)

### Daten werden nicht angezeigt
- Aktualisieren Sie die Seite (F5)
- Überprüfen Sie die Browser-Konsole auf Fehler
- Stellen Sie sicher, dass der Server läuft

## 📞 Weitere Hilfe

Weitere Informationen finden Sie in der README.md Datei.
