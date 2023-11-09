const Account = require('../models/Account');
const bcrypt = require('bcrypt');

const statsDClient = require('../metric');
const logger = require('../log');

const authenticateUser = async (req, res, next) => {

    logger.debug(`Accessed authenticateUser()`);
    const sanitizedPath = req.originalUrl.split(/[?#]/)[0];
    const tags = { method: `${req.method}`, path: sanitizedPath };
    // const tags = { method: `${req.method}`, path: `${req.baseUrl}` };
    statsDClient.increment(`api.${req.method}.${tags.path}`, 1, tags);

    try {
        const authorization = req.get('Authorization');

        if (!authorization) {
            logger.error("Authentication failed: Basic Authentication is required");
            return res.status(401).header('WWW-Authenticate', 'Basic').send("Authentication required");
        }

        const encodedCredentials = authorization.replace('Basic ', '');
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
        const [username, password] = decodedCredentials.split(':');
        const account = await Account.findOne({ where: { email: username } });

        if (!account) {
            logger.error(`Authentication failed: User: ${username} Not found`);
            return res.status(401).send("Unauthorized: Invalid username or password");
        }

        const isValidPassword = await bcrypt.compare(password, account.password);

        if (!isValidPassword) {
            logger.error(`Authentication failed: Invalid password for user: ${username}`);
            console.error(`Authentication failed: Invalid password for user: ${username}`);
            return res.status(401).send("Unauthorized: Invalid username or password");
        }

        req.account = account;
        next();

    } catch (err) {
        logger.error(`Authentication failed: ${err.message}`);
        console.error(`Authentication failed: ${err.message}`);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { authenticateUser };