// Loading environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { healthRoutes, assignmentRoutes } = require('./routes');

const processCsv = require('./helpers/userImporter');
const app = express();

// body-parser middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(healthRoutes);
app.use('/v1/assignments', assignmentRoutes);

let filePath = path.join(__dirname, '/opt/users.csv');
console.log('ENV_TYPE: ', process.env.ENV_TYPE);

if (process.env.ENV_TYPE === 'DEBIAN_VM') {
    filePath = '/opt/users.csv'
}
else if (process.env.ENV_TYPE === 'GITHUB_CI') {
    filePath = path.join(__dirname, '/opt/users.csv');
}

processCsv(filePath);

module.exports = app;
