// Loading environment variables from .env file
require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');

const { healthRoutes, assignmentRoutes } = require('./routes');


const app = express();

// body-parser middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(healthRoutes);
app.use('/v2/assignments', assignmentRoutes);





module.exports = app;
