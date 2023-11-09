const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;

const customFormat = combine(timestamp(), printf((logObject) => {
    return `${logObject.timestamp} [${logObject.level.toUpperCase()}] - ${logObject.message}`
}));

const loggerTransports = [];

if (process.env.ENV_TYPE !== 'GITHUB_CI') {
  loggerTransports.push(
    new transports.File({ filename: '/var/log/webapp/csye6225.log' })
  );
}


const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports: loggerTransports
});

module.exports = logger;