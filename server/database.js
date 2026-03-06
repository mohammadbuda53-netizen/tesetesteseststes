const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'handwerker.db'));

// Initialize database tables
function initDatabase() {
  // Craftsmen table
  db.exec(`
    CREATE TABLE IF NOT EXISTS craftsmen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      trade TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      hourly_rate REAL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Jobs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      customer_id INTEGER,
      craftsman_id INTEGER,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'normal',
      start_date DATE,
      end_date DATE,
      estimated_hours REAL,
      actual_hours REAL,
      total_cost REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (craftsman_id) REFERENCES craftsmen(id)
    )
  `);

  console.log('Database initialized successfully');
}

initDatabase();

module.exports = db;
