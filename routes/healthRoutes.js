const express = require('express');
const { checkHealth } = require('../controllers/HealthZ');

const router = express.Router();

router.get('/healthz', checkHealth);

// Middleware to handle any unsupported methods
router.use('/healthz', (req, res, next) => {
    if (req.method !== 'GET') {
        return res.status(405).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }).send();
    }
    // If method is GET, continue to the health check handler
    next();
});

module.exports = router;
