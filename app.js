
const express = require('express');
const accountController = require('./controllers/accountController'); 
const dotenv = require("dotenv")
const apiRouter = require('./routes/api');
const app = express();
dotenv.config()
const bodyParser = require('body-parser');

const sequelize = require('./config/database');

sequelize.sync().then(() => {
  console.log('Connected to the database.');

  accountController.loadUsersFromCSV(); 
});

app.use(bodyParser.json());

app.use(apiRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(process.env.DB_Database);
});
