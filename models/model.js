// Load environment variables from .env file into process.env
require('dotenv').config();

const Sequelize = require('sequelize');
// Import database configuration
const config = require('../config/config');

const Account = require('./Account');
const Assignment = require('./Assignment');
const Submission = require('./submission'); 

const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];
console.log("current config", currentConfig);
const db = new Sequelize({ ...currentConfig });

// Initialize models
// Sequelize database connection (instance)
Account.initModel(db);
Assignment.initModel(db);
Submission.initModel(db); 

// Define associations
Account.hasMany(Assignment, { foreignKey: 'accountId', as: 'assignments' });
Assignment.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

// Assignment.hasMany(Submission, { foreignKey: 'assignment_id', as: 'submissions', onDelete: 'CASCADE' });
Assignment.hasMany(Submission, { foreignKey: 'assignment_id', as: 'submissions' });
Submission.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });


module.exports = { db, Account, Assignment, Submission}