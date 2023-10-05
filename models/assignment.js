const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Account = require('./account'); // Import the User model

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100,
    },
  },
  num_of_attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100,
    },
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  assignment_created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  assignment_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  accountId: { // Use a field name such as accountId to reference the id field of Account
    type: DataTypes.UUID, // Data type should match the id field of Account
    allowNull: false,
    references: {
      model: Account, // Reference the Account model
      key: 'id', // Reference the id field in the Account model
    },
  },
});

module.exports = Assignment;
