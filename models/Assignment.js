const { Sequelize, DataTypes, Model } = require('sequelize');

class Assignment extends Model { }

Assignment.initModel = (db) => {

  Assignment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountId: {
      // foreign key
      type: DataTypes.UUID,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
        isInt: true
      }
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
        isInt: true
      }
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    assignment_created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    assignment_updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize: db,
    modelName: 'Assignment',
    tableName: 'assignments',
    timestamps: false,
    hooks: {
      beforeCreate: (assignment, options) => {
        // Set to current time during creation
        assignment.assignment_updated = new Date();
      }
    }
  });

}

module.exports = Assignment;
