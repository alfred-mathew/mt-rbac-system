import { env } from "./config/env"
import { db, shutdownPool } from "./db";
import { logger } from "./logger"
import { buildServer } from "./server"
import { migrate } from "drizzle-orm/node-postgres/migrator"

async function shutdownOnSignal(app: Awaited<ReturnType<typeof buildServer>>) {
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
        process.on(signal, () => {
            logger.info('Got signal', signal);
            app.close(() => {
                logger.info('Server has stopped, closing database');
                shutdownPool().then(() => {
                    logger.info('Database has closed, exiting process');
                    process.exit(0);
                })
            });
        })
    })
}

async function main() {
    const app = await buildServer();
    const listenOpts = {
        port: env.PORT,
        host: env.HOST,
    };
    logger.debug(env, "Using env");

    await app.listen(listenOpts);

    const migrationConfig = {
        migrationsFolder: './migrations',
    };
    await migrate(db, migrationConfig);

    logger.debug(`Server is running on port ${env.PORT}`);

    shutdownOnSignal(app);
}

main()