const sequelize = require('../config/database');

//Database Connection
async function databaseConnection(){
    try{
        await sequelize.authenticate();
        console.log("Healthy database connection");
        return true;
    }
    catch (error){
        //If there is an authentication error
        if(error.name === 'SequelizeAccessDeniedError') {
            console.error("Authentication error: Invalid credentials");
        }
        else{
            console.error("Unhealthy database connection");
        }
        return false;
    }
}

module.exports = databaseConnection;