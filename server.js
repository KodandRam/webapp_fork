// Loading environment variables from .env file
require('dotenv').config();

const app = require('./app');

// Importing Sequelize database connection (instance)
const { db } = require('./models/model');

const PORT = process.env.PORT || 8000;

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
        process.exit(1);
    });
