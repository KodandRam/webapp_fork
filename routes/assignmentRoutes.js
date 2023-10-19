const express = require('express');
const { authenticateUser } = require('../middleware/authenticateUser');
const { getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment } = require('../controllers/Assignment');

const router = express.Router();

// Middleware to handle the PATCH method with authentication
router.patch('*', authenticateUser, (req, res) => {
    return res.status(405).json({ error: 'Method PATCH not allowed.' });
});

router.get('/', authenticateUser, getAssignments);
router.get('/:id', authenticateUser, getAssignmentById);
router.post('/', authenticateUser, createAssignment);
router.put('/:id', authenticateUser, updateAssignment);
router.delete('/:id', authenticateUser, deleteAssignment);

// Middleware to handle unsupported methods for assignment routes
router.use((req, res, next) => {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
});

module.exports = router;
