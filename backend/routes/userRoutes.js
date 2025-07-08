const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  toggleMemberStatus,
} = require('../controllers/userController');
const {
  verifyToken,
  requireRole,
} = require('../middleware/authMiddleware');

router.get('/members', verifyToken, requireRole('TRAINER'), getAllMembers);
router.put('/members/:id/toggle', verifyToken, requireRole('TRAINER'), toggleMemberStatus);

module.exports = router;
