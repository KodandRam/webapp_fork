const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const Account = require('../models/Account');

const logger = require('../log');

const processCsv = async (filePath) => {
    fs.createReadStream(filePath)
        .on('error', (err) => {
            logger.error('Error reading the CSV file:', err.message);
            console.error('Error reading the CSV file:', err.message);
        })
        .pipe(csv())
        .on('data', async (row) => {
            processRow(row);
        })
        .on('end', () => {
            logger.info('CSV file successfully processed..');
            console.log('CSV file successfully processed..');
        });
};

const processRow = async (row) => {
    try {
        const [user, created] = await Account.findOrCreate({
            where: { email: row.email },
            defaults: {
                first_name: row.first_name,
                last_name: row.last_name,
                password: await bcrypt.hash(row.password, 10),
                account_created: new Date(),
                account_updated: new Date()
            }
        });

        if (created) {
            logger.info(`User ${row.email} created.`);
            console.log(`User ${row.email} created.`);
        } else {
            logger.warn(`User ${row.email} already exists.`);
            console.log(`User ${row.email} already exists.`);
        }

    } catch (err) {
        logger.error('Error processing user:', err);
        console.error('Error processing user:', err);
    }
};

module.exports = processCsv;