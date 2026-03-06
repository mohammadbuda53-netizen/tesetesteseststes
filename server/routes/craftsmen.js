const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all craftsmen
router.get('/', (req, res) => {
  try {
    const craftsmen = db.prepare('SELECT * FROM craftsmen ORDER BY created_at DESC').all();
    res.json(craftsmen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single craftsman
router.get('/:id', (req, res) => {
  try {
    const craftsman = db.prepare('SELECT * FROM craftsmen WHERE id = ?').get(req.params.id);
    if (!craftsman) {
      return res.status(404).json({ error: 'Craftsman not found' });
    }
    res.json(craftsman);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create craftsman
router.post('/', (req, res) => {
  try {
    const { name, trade, phone, email, hourly_rate } = req.body;
    const stmt = db.prepare(`
      INSERT INTO craftsmen (name, trade, phone, email, hourly_rate)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, trade, phone, email, hourly_rate);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update craftsman
router.put('/:id', (req, res) => {
  try {
    const { name, trade, phone, email, hourly_rate, status } = req.body;
    const stmt = db.prepare(`
      UPDATE craftsmen 
      SET name = ?, trade = ?, phone = ?, email = ?, hourly_rate = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(name, trade, phone, email, hourly_rate, status, req.params.id);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete craftsman
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM craftsmen WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Craftsman deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
