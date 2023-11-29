const axios = require('axios');
const fs = require('fs');

const downloadAndSaveZip = async (url, savePath) => {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        if (response.headers['content-length'] === '0') {
            throw new Error('Downloaded content is 0 bytes');
        }

        const writer = fs.createWriteStream(savePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (err) {
        throw new Error(`Error downloading file: ${err.message}`);
    }
};

module.exports = { downloadAndSaveZip };