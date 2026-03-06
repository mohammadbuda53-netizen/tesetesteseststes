const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all customers
router.get('/', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single customer
router.get('/:id', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer
router.post('/', (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    const stmt = db.prepare(`
      INSERT INTO customers (name, address, phone, email)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, address, phone, email);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    const stmt = db.prepare(`
      UPDATE customers 
      SET name = ?, address = ?, phone = ?, email = ?
      WHERE id = ?
    `);
    stmt.run(name, address, phone, email, req.params.id);
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
