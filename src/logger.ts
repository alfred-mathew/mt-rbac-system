import pino from "pino";

export const logger = pino({
    redact: ['DB_CONN', 'SIGNING_SECRET'],
    level: 'debug',
    transport: {
        target: 'pino-pretty',
    },
});