// Loading environment variables from .env file
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
// const filePath = '/opt/users.csv'
processCsv(filePath);

// Sync the database and start the server 
// Set force to false to avoid dropping tables

// alter: true: Adjusts database tables to match model definitions. 
// Adds or removes columns as necessary without dropping tables. 
// Useful for updating the database schema after changes to models

db.sync({ force: false, alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Web Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
        process.exit(1);  // Exit the process with failure code
    });

module.exports = app;