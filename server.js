// Loading environment variables from .env file
require('dotenv').config();

const app = require('./app');

const processCsv = require('./helpers/userImporter');

// Importing Sequelize database connection (instance)
const { db } = require('./models/model');
const processCsv = require('./helpers/userImporter');
const logger = require('./log');

const PORT = process.env.PORT || 8080;

// Sync the database and start the server 
// Set force to false to avoid dropping tables

// alter: true: Adjusts database tables to match model definitions. 
// Adds or removes columns as necessary without dropping tables. 
// Useful for updating the database schema after changes to models

let filePath = path.join(__dirname, '/opt/users.csv');

if (process.env.ENV_TYPE === 'DEBIAN_VM') {
    filePath = '/opt/users.csv'
}
else if (process.env.ENV_TYPE === 'GITHUB_CI') {
    filePath = path.join(__dirname, '/opt/users.csv');
}

db.sync({ force: false, alter: true })
    .then(() => {
        processCsv(filePath);
        app.listen(PORT, () => {
            logger.info(`Web server running on http://localhost:${PORT}`);
            console.log(`Web Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        logger.error('Error syncing database:', error);
        console.error('Error syncing database:', error);
        process.exit(1);
    });


