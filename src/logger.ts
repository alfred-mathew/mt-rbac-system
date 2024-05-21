import pino from "pino";

export const logger = pino({
    redact: ['DB_CONN'],
    level: 'debug',
    transport: {
        target: 'pino-pretty',
    },
});