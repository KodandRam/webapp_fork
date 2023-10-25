// controllers/accountController.js
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const Account  = require('../models/Account');

async function loadUsersFromCSV() {
  try {
    const filePath = '/Users/movvakodandram/kodandram_movva_002701533_03/webapp_fork/users.csv';

    if (fs.existsSync(filePath)) {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (row) => {
          // Create a user from the CSV row
          await Account.findOrCreate({
            where: { email: row.email },
            defaults: {
              first_name: row.first_name,
              last_name: row.last_name,
              password: await bcrypt.hash(row.password, 10),
            },
          });
        })
        .on('end', () => {
          console.log('Users loaded from CSV.');
        });
    } else {
      console.error('CSV file not found.');
    }
  } catch (err) {
    console.error('Error loading users from CSV:', err);
  }
}

module.exports = {
  loadUsersFromCSV,
};
