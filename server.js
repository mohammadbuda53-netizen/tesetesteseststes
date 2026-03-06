import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Data storage (in-memory with file persistence)
const DATA_FILE = join(__dirname, 'data.json');

let data = {
  handwerker: [],
  kunden: [],
  auftrage: []
};

// Load data from file
async function loadData() {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8');
    data = JSON.parse(fileContent);
    console.log('Daten erfolgreich geladen');
  } catch (error) {
    console.log('Keine vorhandenen Daten gefunden, starte mit leeren Daten');
    await saveData();
  }
}

// Save data to file
async function saveData() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
  }
}

// ===== HANDWERKER ROUTES =====

// Get all handwerker
app.get('/api/handwerker', (req, res) => {
  res.json(data.handwerker);
});

// Get single handwerker
app.get('/api/handwerker/:id', (req, res) => {
  const handwerker = data.handwerker.find(h => h.id === req.params.id);
  if (!handwerker) {
    return res.status(404).json({ error: 'Handwerker nicht gefunden' });
  }
  res.json(handwerker);
});

// Create handwerker
app.post('/api/handwerker', async (req, res) => {
  const newHandwerker = {
    id: Date.now().toString(),
    ...req.body,
    erstelltAm: new Date().toISOString()
  };
  data.handwerker.push(newHandwerker);
  await saveData();
  res.status(201).json(newHandwerker);
});

// Update handwerker
app.put('/api/handwerker/:id', async (req, res) => {
  const index = data.handwerker.findIndex(h => h.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Handwerker nicht gefunden' });
  }
  data.handwerker[index] = { ...data.handwerker[index], ...req.body };
  await saveData();
  res.json(data.handwerker[index]);
});

// Delete handwerker
app.delete('/api/handwerker/:id', async (req, res) => {
  const index = data.handwerker.findIndex(h => h.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Handwerker nicht gefunden' });
  }
  data.handwerker.splice(index, 1);
  await saveData();
  res.status(204).send();
});

// ===== KUNDEN ROUTES =====

// Get all kunden
app.get('/api/kunden', (req, res) => {
  res.json(data.kunden);
});

// Get single kunde
app.get('/api/kunden/:id', (req, res) => {
  const kunde = data.kunden.find(k => k.id === req.params.id);
  if (!kunde) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  res.json(kunde);
});

// Create kunde
app.post('/api/kunden', async (req, res) => {
  const newKunde = {
    id: Date.now().toString(),
    ...req.body,
    erstelltAm: new Date().toISOString()
  };
  data.kunden.push(newKunde);
  await saveData();
  res.status(201).json(newKunde);
});

// Update kunde
app.put('/api/kunden/:id', async (req, res) => {
  const index = data.kunden.findIndex(k => k.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  data.kunden[index] = { ...data.kunden[index], ...req.body };
  await saveData();
  res.json(data.kunden[index]);
});

// Delete kunde
app.delete('/api/kunden/:id', async (req, res) => {
  const index = data.kunden.findIndex(k => k.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  data.kunden.splice(index, 1);
  await saveData();
  res.status(204).send();
});

// ===== AUFTRÄGE ROUTES =====

// Get all auftrage
app.get('/api/auftrage', (req, res) => {
  res.json(data.auftrage);
});

// Get single auftrag
app.get('/api/auftrage/:id', (req, res) => {
  const auftrag = data.auftrage.find(a => a.id === req.params.id);
  if (!auftrag) {
    return res.status(404).json({ error: 'Auftrag nicht gefunden' });
  }
  res.json(auftrag);
});

// Create auftrag
app.post('/api/auftrage', async (req, res) => {
  const newAuftrag = {
    id: Date.now().toString(),
    ...req.body,
    erstelltAm: new Date().toISOString()
  };
  data.auftrage.push(newAuftrag);
  await saveData();
  res.status(201).json(newAuftrag);
});

// Update auftrag
app.put('/api/auftrage/:id', async (req, res) => {
  const index = data.auftrage.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Auftrag nicht gefunden' });
  }
  data.auftrage[index] = { ...data.auftrage[index], ...req.body };
  await saveData();
  res.json(data.auftrage[index]);
});

// Delete auftrag
app.delete('/api/auftrage/:id', async (req, res) => {
  const index = data.auftrage.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Auftrag nicht gefunden' });
  }
  data.auftrage.splice(index, 1);
  await saveData();
  res.status(204).send();
});

// ===== STATISTICS ROUTE =====
app.get('/api/statistics', (req, res) => {
  const stats = {
    totalHandwerker: data.handwerker.length,
    totalKunden: data.kunden.length,
    totalAuftrage: data.auftrage.length,
    offeneAuftrage: data.auftrage.filter(a => a.status === 'Offen').length,
    inBearbeitungAuftrage: data.auftrage.filter(a => a.status === 'In Bearbeitung').length,
    abgeschlosseneAuftrage: data.auftrage.filter(a => a.status === 'Abgeschlossen').length
  };
  res.json(stats);
});

// Start server
async function startServer() {
  await loadData();
  app.listen(PORT, () => {
    console.log(`🔧 Handwerker Management App läuft auf http://localhost:${PORT}`);
  });
}

startServer();
