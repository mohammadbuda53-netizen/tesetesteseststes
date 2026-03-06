const express = require('express');
const initSqlJs = require('sql.js');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
let db;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function initDb() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'handwerker.db');
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialty TEXT,
      hourlyRate REAL DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      company TEXT
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'offen',
      startDate TEXT,
      endDate TEXT,
      price REAL DEFAULT 0,
      FOREIGN KEY (customerId) REFERENCES customers(id)
    );

    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workerId INTEGER,
      jobId INTEGER,
      date TEXT,
      hours REAL DEFAULT 0,
      description TEXT,
      FOREIGN KEY (workerId) REFERENCES workers(id),
      FOREIGN KEY (jobId) REFERENCES jobs(id)
    );
  `);
  
  saveDb();
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(__dirname, 'handwerker.db'), buffer);
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function runSql(sql, params = []) {
  db.run(sql, params);
  saveDb();
  return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
}

app.get('/api/dashboard', (req, res) => {
  const workers = queryAll('SELECT * FROM workers WHERE active = 1');
  const jobs = queryAll("SELECT * FROM jobs WHERE status != 'abgeschlossen'");
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = queryAll('SELECT * FROM time_entries WHERE date = ?', [today]);
  const totalRevenue = queryOne("SELECT SUM(price) as total FROM jobs WHERE status = 'abgeschlossen'");
  
  res.json({ workers, jobs, todayEntries, totalRevenue: totalRevenue?.total || 0 });
});

app.get('/api/workers', (req, res) => {
  res.json(queryAll('SELECT * FROM workers ORDER BY name'));
});

app.post('/api/workers', (req, res) => {
  const { name, email, phone, specialty, hourlyRate } = req.body;
  const result = runSql(
    'INSERT INTO workers (name, email, phone, specialty, hourlyRate) VALUES (?, ?, ?, ?, ?)',
    [name, email || null, phone || null, specialty || null, hourlyRate || 0]
  );
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/workers/:id', (req, res) => {
  const { name, email, phone, specialty, hourlyRate, active } = req.body;
  runSql(
    'UPDATE workers SET name = ?, email = ?, phone = ?, specialty = ?, hourlyRate = ?, active = ? WHERE id = ?',
    [name, email || null, phone || null, specialty || null, hourlyRate || 0, active, req.params.id]
  );
  res.json({ success: true });
});

app.delete('/api/workers/:id', (req, res) => {
  runSql('DELETE FROM workers WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/customers', (req, res) => {
  res.json(queryAll('SELECT * FROM customers ORDER BY name'));
});

app.post('/api/customers', (req, res) => {
  const { name, email, phone, address, company } = req.body;
  const result = runSql(
    'INSERT INTO customers (name, email, phone, address, company) VALUES (?, ?, ?, ?, ?)',
    [name, email || null, phone || null, address || null, company || null]
  );
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/customers/:id', (req, res) => {
  const { name, email, phone, address, company } = req.body;
  runSql(
    'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, company = ? WHERE id = ?',
    [name, email || null, phone || null, address || null, company || null, req.params.id]
  );
  res.json({ success: true });
});

app.delete('/api/customers/:id', (req, res) => {
  runSql('DELETE FROM customers WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/jobs', (req, res) => {
  const jobs = queryAll(`
    SELECT j.*, c.name as customerName 
    FROM jobs j 
    LEFT JOIN customers c ON j.customerId = c.id 
    ORDER BY j.startDate DESC
  `);
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const { customerId, title, description, status, startDate, endDate, price } = req.body;
  const result = runSql(
    'INSERT INTO jobs (customerId, title, description, status, startDate, endDate, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [customerId || null, title, description || null, status || 'offen', startDate || null, endDate || null, price || 0]
  );
  res.json({ id: result.lastInsertRowid });
});

app.put('/api/jobs/:id', (req, res) => {
  const { customerId, title, description, status, startDate, endDate, price } = req.body;
  runSql(
    'UPDATE jobs SET customerId = ?, title = ?, description = ?, status = ?, startDate = ?, endDate = ?, price = ? WHERE id = ?',
    [customerId || null, title, description || null, status, startDate || null, endDate || null, price || 0, req.params.id]
  );
  res.json({ success: true });
});

app.delete('/api/jobs/:id', (req, res) => {
  runSql('DELETE FROM jobs WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

app.get('/api/time-entries', (req, res) => {
  const entries = queryAll(`
    SELECT t.*, w.name as workerName, j.title as jobTitle
    FROM time_entries t
    LEFT JOIN workers w ON t.workerId = w.id
    LEFT JOIN jobs j ON t.jobId = j.id
    ORDER BY t.date DESC
  `);
  res.json(entries);
});

app.post('/api/time-entries', (req, res) => {
  const { workerId, jobId, date, hours, description } = req.body;
  const result = runSql(
    'INSERT INTO time_entries (workerId, jobId, date, hours, description) VALUES (?, ?, ?, ?, ?)',
    [workerId || null, jobId || null, date, hours || 0, description || null]
  );
  res.json({ id: result.lastInsertRowid });
});

app.delete('/api/time-entries/:id', (req, res) => {
  runSql('DELETE FROM time_entries WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
