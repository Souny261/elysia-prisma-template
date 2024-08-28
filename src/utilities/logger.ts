import pino from "pino";

export const logger = {
    Info: (message: any) => {
        log('Info', message);
        loggerPino.info(message);
    },
    Warn: (message: any) => {
        log('Warn', message);
        loggerPino.warn(message);
    },
    Error: (message: any) => {
        log('Error', message);
        loggerPino.error(message);
    },
    Debug: (message: any) => {
        log('Debug', message);
        loggerPino.debug(message);
    }
};

function log(level: string, message: any) {
    let time = new Date().toISOString();
    let formattedMessage;

    if (message instanceof Error) {
        formattedMessage = message.stack || message.message;
    } else if (typeof message === 'object') {
        formattedMessage = JSON.stringify(message);
    } else {
        formattedMessage = message;
    }

    console.log(`{"level":"${level.toUpperCase()}","time":"${time}","msg":"${formattedMessage}"}`);

}

const loggerPino = pino({
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
}, pino.destination("./logs/elysia.log"));

