require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { healthRoutes, assignmentRoutes } = require('./routes');

// Importing Sequelize database connection (instance)
const { db } = require('./models/model');

const processCsv = require('./helpers/userImporter');
const app = express();

// body-parser middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.use(healthRoutes);
app.use('/v1/assignments', assignmentRoutes);

const filePath = path.join(__dirname, '/opt/users.csv');

// Process CSV only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    processCsv(filePath);
}

const startServer = () => {
    db.sync({ force: false, alter: true })
        .then(() => {
            const server = app.listen(PORT, () => {
                console.log(`Web Server running on http://localhost:${PORT}`);
            });
            return server;
        })
        .catch((error) => {
            console.error('Error syncing database:', error);
            process.exit(1);  // Exit the process with failure code
        });
};

// Check for testing environment before starting the server
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = {
    app,
    startServer
};
