import { env } from "./config/env"
import { db } from "./db";
import { logger } from "./logger"
import { buildServer } from "./server"
import { migrate } from "drizzle-orm/node-postgres/migrator"

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
}

main()