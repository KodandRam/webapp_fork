require('dotenv').config();
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { healthRoutes, assignmentRoutes } = require('./routes');

// Importing Sequelize database connection (instance)
const { db } = require('./models/model');

const processCsv = require('./helpers/userImporter');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

// Routes
app.use(healthRoutes);
app.use('/v1/assignments', assignmentRoutes);

// Process CSV
const filePath = path.join(__dirname, '/opt/users.csv');
processCsv(filePath);

// Start the server function
const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Web Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

// Sync the database and start the server
db.sync({ force: false, alter: true })
    .then(startServer)
    .catch((error) => {
        console.error('Error syncing database:', error);
        process.exit(1);
    });

module.exports = app;