import { env } from "./config/env";
import { buildServer } from "./server"

async function main() {
    const app = await buildServer();
    const listenOpts = {
        port: env.PORT,
        host: env.HOST,
    };
    await app.listen(listenOpts);
    console.debug("Server is running on port", env.PORT);
}

main()