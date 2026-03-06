const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const craftsmenRoutes = require('./routes/craftsmen');
const customersRoutes = require('./routes/customers');
const jobsRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/craftsmen', craftsmenRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/jobs', jobsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Handwerker Management API is running' });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
