const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all jobs with customer and craftsman details
router.get('/', (req, res) => {
  try {
    const jobs = db.prepare(`
      SELECT 
        j.*,
        c.name as customer_name,
        cr.name as craftsman_name,
        cr.trade as craftsman_trade
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      LEFT JOIN craftsmen cr ON j.craftsman_id = cr.id
      ORDER BY j.created_at DESC
    `).all();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single job
router.get('/:id', (req, res) => {
  try {
    const job = db.prepare(`
      SELECT 
        j.*,
        c.name as customer_name,
        c.phone as customer_phone,
        c.address as customer_address,
        cr.name as craftsman_name,
        cr.trade as craftsman_trade,
        cr.hourly_rate as craftsman_rate
      FROM jobs j
      LEFT JOIN customers c ON j.customer_id = c.id
      LEFT JOIN craftsmen cr ON j.craftsman_id = cr.id
      WHERE j.id = ?
    `).get(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create job
router.post('/', (req, res) => {
  try {
    const { 
      title, description, customer_id, craftsman_id, 
      status, priority, start_date, end_date, 
      estimated_hours, actual_hours, total_cost 
    } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO jobs (
        title, description, customer_id, craftsman_id,
        status, priority, start_date, end_date,
        estimated_hours, actual_hours, total_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title, description, customer_id, craftsman_id,
      status || 'pending', priority || 'normal', 
      start_date, end_date, estimated_hours, actual_hours, total_cost
    );
    
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update job
router.put('/:id', (req, res) => {
  try {
    const { 
      title, description, customer_id, craftsman_id,
      status, priority, start_date, end_date,
      estimated_hours, actual_hours, total_cost
    } = req.body;
    
    const stmt = db.prepare(`
      UPDATE jobs 
      SET title = ?, description = ?, customer_id = ?, craftsman_id = ?,
          status = ?, priority = ?, start_date = ?, end_date = ?,
          estimated_hours = ?, actual_hours = ?, total_cost = ?
      WHERE id = ?
    `);
    
    stmt.run(
      title, description, customer_id, craftsman_id,
      status, priority, start_date, end_date,
      estimated_hours, actual_hours, total_cost,
      req.params.id
    );
    
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete job
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM jobs WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
