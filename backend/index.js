const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // for later

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/payments', paymentRoutes); // future Stripe integration

// Root route
app.get("/", (req, res) => res.send("Gym Backend is running"));

// Error handler (always after routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Admin seeder before server starts
const ensureAdminExists = require('./seedAdmin');

// Start server after admin account check
const PORT = process.env.PORT || 5000;

ensureAdminExists().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error(" Failed to ensure admin account:", err);
});
