const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/checkout', verifyToken, createCheckoutSession);

module.exports = router;
