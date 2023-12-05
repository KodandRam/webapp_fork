const { Sequelize, DataTypes, Model } = require('sequelize');

class Account extends Model { }

Account.initModel = (db) => {

  Account.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  }, {
    sequelize: db,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: false
  })

};

module.exports = Account;
