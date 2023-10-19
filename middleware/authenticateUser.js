const Account = require('../models/Account');
const bcrypt = require('bcrypt');

const authenticateUser = async (req, res, next) => {
    try {
        const authorization = req.get('Authorization');

        if (!authorization) {
            console.log("Authentication failed: Basic Authentication is required");
            return res.status(401).header('WWW-Authenticate', 'Basic').send("Authentication required");
        }

        const encodedCredentials = authorization.replace('Basic ', '');
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
        const [username, password] = decodedCredentials.split(':');
        console.log(username, password)
        const account = await Account.findOne({ where: { email: username } });

        if (!account) {
            console.error(`Authentication failed: User: ${username} Not found`);
            return res.status(401).send("Unauthorized: Invalid username or password");
        }

        const isValidPassword = await bcrypt.compare(password, account.password);

        if (!isValidPassword) {
            console.error(`Authentication failed: Invalid password for user: ${username}`);
            return res.status(401).send("Unauthorized: Invalid username or password");
        }

        req.account = account;
        next();

    } catch (err) {
        console.error(`Authentication failed: ${err.message}`);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = { authenticateUser };