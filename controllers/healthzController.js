const databaseConnection = require('../models/healthCheck');

// Validate the health of the database connection
// If the connection is healthy return the response as 200(Ok)
// Else if the connection is unhealthy return the response as 503(Service Unavailable)
// return response 400(Bad Request) if there are additional parameters attatched to the request
const databaseHealth = async (req,res,next) => {
    
    // If there is a body in the request, then return a response as 400(Bad Request)
    if (req.body && Object.keys(req.body).length !== 0) {
        return res.status(400).header('Cache-Control', 'no-cache').send();
    } 

    //If there are any query parameters in the request, then return a response as 400(Bad Request)
    if(req.query && Object.keys(req.query).length !== 0){
        return res.status(400).header('Cache-Control', 'no-cache').send();
    }

    const isHealthyConnection = await databaseConnection();
    
    if(isHealthyConnection){
        res.status(200).header('Cache-Control', 'no-cache').send();
    }
    else{
        res.status(503).header('Cache-Control', 'no-cache').send();
    }
};

module.exports = databaseHealth;