const { db } = require('../models/model');
const logger = require('../log');

const hasPayload = (req) => req.body && Object.keys(req.body).length !== 0;
const hasQueryParameters = (req) => req.query && Object.keys(req.query).length !== 0;

const statsDClient = require('../metric');


const checkHealth = async (req, res) => {
    const tags = { method: 'GET', path: `${req.originalUrl}` };
    statsDClient.increment(`api.${req.method}.${tags.path}`, 1, tags);
    logger.debug(`Accessed /healthz endpoint`)
    
    if (hasPayload(req) || hasQueryParameters(req)) {
        // Payload not allowed, Query parameters not allowed
        logger.error(`Bad Request: Payload or Query parameters not allowed`);
        return res.status(400).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send();
    }

    try {
        // checks the health of the database server
        await db.authenticate();

        logger.info("Server Health Check is OK, Database Connection Successful");
        // connection to the database is successful
        res.status(200).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'X-Content-Type-Options': 'nosniff'
        }).send();

    } catch (error) {
        // console.error("Database Connection Error:", error.message);
        // error (database is down or issues with authentication)
        logger.error("Server Health Check is NOT OK, Database Connection Error:", error.message);
        res.status(503).set({
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }).send();
    }
};

module.exports = {
    checkHealth
};