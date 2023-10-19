// Load environment variables from .env file into process.env
require('dotenv').config();

const Sequelize = require('sequelize');
// Import database configuration
const config = require('../config/database');

const Account = require('./account');
const Assignment = require('./assignment');

const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];
const db = new Sequelize({ ...currentConfig });

// Initialize models
// Sequelize database connection (instance)
Account.initModel(db);
Assignment.initModel(db);

// Define associations
Account.hasMany(Assignment, { foreignKey: 'accountId', as: 'assignments' });
Assignment.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

module.exports = { db, Account, Assignment }