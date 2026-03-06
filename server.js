const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory database (für Demonstration)
const db = {
  craftsmen: [],
  jobs: [],
  customers: [],
  appointments: [],
  invoices: []
};

// ID Generator
let idCounter = {
  craftsmen: 1,
  jobs: 1,
  customers: 1,
  appointments: 1,
  invoices: 1
};

// ==================== CRAFTSMEN ROUTES ====================

// Get all craftsmen
app.get('/api/craftsmen', (req, res) => {
  res.json(db.craftsmen);
});

// Get craftsman by ID
app.get('/api/craftsmen/:id', (req, res) => {
  const craftsman = db.craftsmen.find(c => c.id === parseInt(req.params.id));
  if (!craftsman) {
    return res.status(404).json({ error: 'Handwerker nicht gefunden' });
  }
  res.json(craftsman);
});

// Create new craftsman
app.post('/api/craftsmen', (req, res) => {
  const craftsman = {
    id: idCounter.craftsmen++,
    name: req.body.name,
    specialty: req.body.specialty,
    phone: req.body.phone,
    email: req.body.email,
    hourlyRate: req.body.hourlyRate,
    status: req.body.status || 'available',
    createdAt: new Date().toISOString()
  };
  db.craftsmen.push(craftsman);
  res.status(201).json(craftsman);
});

// Update craftsman
app.put('/api/craftsmen/:id', (req, res) => {
  const index = db.craftsmen.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Handwerker nicht gefunden' });
  }
  db.craftsmen[index] = {
    ...db.craftsmen[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  res.json(db.craftsmen[index]);
});

// Delete craftsman
app.delete('/api/craftsmen/:id', (req, res) => {
  const index = db.craftsmen.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Handwerker nicht gefunden' });
  }
  db.craftsmen.splice(index, 1);
  res.status(204).send();
});

// ==================== CUSTOMERS ROUTES ====================

// Get all customers
app.get('/api/customers', (req, res) => {
  res.json(db.customers);
});

// Get customer by ID
app.get('/api/customers/:id', (req, res) => {
  const customer = db.customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  res.json(customer);
});

// Create new customer
app.post('/api/customers', (req, res) => {
  const customer = {
    id: idCounter.customers++,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    notes: req.body.notes || '',
    createdAt: new Date().toISOString()
  };
  db.customers.push(customer);
  res.status(201).json(customer);
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const index = db.customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  db.customers[index] = {
    ...db.customers[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  res.json(db.customers[index]);
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
  const index = db.customers.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Kunde nicht gefunden' });
  }
  db.customers.splice(index, 1);
  res.status(204).send();
});

// ==================== JOBS ROUTES ====================

// Get all jobs
app.get('/api/jobs', (req, res) => {
  res.json(db.jobs);
});

// Get job by ID
app.get('/api/jobs/:id', (req, res) => {
  const job = db.jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: 'Auftrag nicht gefunden' });
  }
  res.json(job);
});

// Create new job
app.post('/api/jobs', (req, res) => {
  const job = {
    id: idCounter.jobs++,
    title: req.body.title,
    description: req.body.description,
    customerId: req.body.customerId,
    craftsmanId: req.body.craftsmanId,
    status: req.body.status || 'pending',
    priority: req.body.priority || 'medium',
    estimatedHours: req.body.estimatedHours,
    actualHours: req.body.actualHours || 0,
    scheduledDate: req.body.scheduledDate,
    createdAt: new Date().toISOString()
  };
  db.jobs.push(job);
  res.status(201).json(job);
});

// Update job
app.put('/api/jobs/:id', (req, res) => {
  const index = db.jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Auftrag nicht gefunden' });
  }
  db.jobs[index] = {
    ...db.jobs[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  res.json(db.jobs[index]);
});

// Delete job
app.delete('/api/jobs/:id', (req, res) => {
  const index = db.jobs.findIndex(j => j.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Auftrag nicht gefunden' });
  }
  db.jobs.splice(index, 1);
  res.status(204).send();
});

// ==================== APPOINTMENTS ROUTES ====================

// Get all appointments
app.get('/api/appointments', (req, res) => {
  res.json(db.appointments);
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const appointment = {
    id: idCounter.appointments++,
    jobId: req.body.jobId,
    craftsmanId: req.body.craftsmanId,
    customerId: req.body.customerId,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    status: req.body.status || 'scheduled',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString()
  };
  db.appointments.push(appointment);
  res.status(201).json(appointment);
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const index = db.appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Termin nicht gefunden' });
  }
  db.appointments[index] = {
    ...db.appointments[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  res.json(db.appointments[index]);
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const index = db.appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Termin nicht gefunden' });
  }
  db.appointments.splice(index, 1);
  res.status(204).send();
});

// ==================== INVOICES ROUTES ====================

// Get all invoices
app.get('/api/invoices', (req, res) => {
  res.json(db.invoices);
});

// Create new invoice
app.post('/api/invoices', (req, res) => {
  const invoice = {
    id: idCounter.invoices++,
    jobId: req.body.jobId,
    customerId: req.body.customerId,
    amount: req.body.amount,
    status: req.body.status || 'pending',
    dueDate: req.body.dueDate,
    items: req.body.items || [],
    createdAt: new Date().toISOString()
  };
  db.invoices.push(invoice);
  res.status(201).json(invoice);
});

// Update invoice
app.put('/api/invoices/:id', (req, res) => {
  const index = db.invoices.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Rechnung nicht gefunden' });
  }
  db.invoices[index] = {
    ...db.invoices[index],
    ...req.body,
    id: parseInt(req.params.id)
  };
  res.json(db.invoices[index]);
});

// ==================== DASHBOARD STATS ====================

app.get('/api/stats', (req, res) => {
  const stats = {
    totalCraftsmen: db.craftsmen.length,
    availableCraftsmen: db.craftsmen.filter(c => c.status === 'available').length,
    totalJobs: db.jobs.length,
    activeJobs: db.jobs.filter(j => j.status === 'in-progress').length,
    pendingJobs: db.jobs.filter(j => j.status === 'pending').length,
    completedJobs: db.jobs.filter(j => j.status === 'completed').length,
    totalCustomers: db.customers.length,
    upcomingAppointments: db.appointments.filter(a => a.status === 'scheduled').length,
    pendingInvoices: db.invoices.filter(i => i.status === 'pending').length,
    totalRevenue: db.invoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0)
  };
  res.json(stats);
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Handwerker Management App läuft auf http://localhost:${PORT}`);
});
