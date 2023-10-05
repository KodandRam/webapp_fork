const { Sequelize } = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "127.0.0.1",
  username: "movvakodandram",
  password: "chicken65",
  database: "movvakodandram",
  createDatabase: true,
});

module.exports = sequelize;