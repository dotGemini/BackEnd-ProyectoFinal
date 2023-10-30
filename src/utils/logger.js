import winston from 'winston';
import config from '../config/config.js';

const logLevels = {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0
};

const logColors = {
    debug: "green",
    http: "cyan",
    info: "gray",
    warning: "blue",
    error: "red",
    fatal: "black"
}

winston.addColors(logColors);

const prodLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.colorize({all: true}),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: `./src/ErrorLogs/error.log`, level: 'error' })
    ],
});

const devLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.colorize({all: true}),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ],
});

export const addLogger = (req, res, next) => {

    switch(config.env){
        case 'developer':
            req.logger = devLogger;
            break;
        case 'production':
            req.logger = prodLogger;
            break;
        default:
            req.logger = devLogger;
    }

    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
};

export const loggerInfo = () => {
    switch(config.env){
        case 'developer':
            return devLogger;
        case 'production':
            return prodLogger;
        default:
            return devLogger;
    }
}