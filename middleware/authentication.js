const Account = require('../models/account');
const bcrypt = require('bcrypt');

const authentication = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized1' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  try {
    const user = await Account.findOne({ where: { email: username } });

    if (!user) {

      return res.status(401).json({ error: 'Unauthorized,username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Unauthorized,password' });
    }

    // Attach the user object to the request for further use in routes
    req.user = {email : username, id : user.id};

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Middleware to handle all other health check request types (put, post, delete, patch)
// Return the status as 405 (Not Supported)
const inValidHealthRequests = (req,res) => {
  if (!['GET'].includes(req.method)) {
    res.status(405).header('Cache-Control', 'no-cache').send();
  }
  else{
    next();
  }
};

// Middleware to handle all other request types (patch)
// Return the status as 405 (Not Supported)
const inValidRequests = (req,res) => {
    return res.status(405).header('Cache-Control', 'no-cache').send();
};

module.exports = {authentication,inValidHealthRequests, inValidRequests};

