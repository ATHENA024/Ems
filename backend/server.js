const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDatabase = require('./seed');

dotenv.config();

async function start() {
  await connectDB();
  await seedDatabase();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/employees', require('./routes/employees'));
  app.use('/api/attendance', require('./routes/attendance'));
  app.use('/api/leaves', require('./routes/leaves'));
  app.use('/api/payroll', require('./routes/payroll'));
  app.use('/api/performance', require('./routes/performance'));
  app.use('/api/appraisals', require('./routes/appraisals'));
  app.use('/api/onboarding', require('./routes/onboarding'));
  app.use('/api/lms', require('./routes/lms'));
  app.use('/api/announcements', require('./routes/announcements'));
  app.use('/api/helpdesk', require('./routes/helpdesk'));
  app.use('/api/reports', require('./routes/reports'));

  if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
