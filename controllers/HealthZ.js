const { db } = require('../models/model');

const hasPayload = (req) => req.body && Object.keys(req.body).length !== 0;
const hasQueryParameters = (req) => req.query && Object.keys(req.query).length !== 0;

const checkHealth = async (req, res) => {
    if (hasPayload(req) || hasQueryParameters(req)) {
        // Payload not allowed, Query parameters not allowed
        return res.status(400).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send();
    }

    try {
        // checks the health of the database server
        await db.authenticate();

        // connection to the database is successful
        res.status(200).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send();

    } catch (error) {
        // console.error("Database Connection Error:", error.message);
        // error (database is down or issues with authentication)
        res.status(503).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }).send();
    }
};

module.exports = {
    checkHealth
};
