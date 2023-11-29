// models/Submission.js
const { Sequelize, DataTypes, Model } = require('sequelize');

class Submission extends Model {}

Submission.initModel = (db) => {
  Submission.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    assignment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'assignments', // 'assignments' refers to table name
        key: 'id',           // 'id' refers to column name in assignments table
      }
    },
    submission_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submission_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    submission_updated: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  }, {
    sequelize: db,
    modelName: 'Submission',
    tableName: 'submissions',
    timestamps: false
  });
};

module.exports = Submission;