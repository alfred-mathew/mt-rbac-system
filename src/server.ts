import fastify from "fastify";
import { logger } from "./logger";
import { routes as applicationRoutes } from "./modules/applications/routes";
import { routes as userRoutes } from "./modules/users/routes";
import { routes as roleRoutes } from "./modules/roles/routes";

export async function buildServer() {
    const serverOpts = {
        logger,
    };
    const app = fastify(serverOpts);
    app.register(applicationRoutes, { prefix: '/api/applications' });
    app.register(userRoutes, { prefix: '/api/users' });
    app.register(roleRoutes, { prefix: '/api/roles' });
    return app;
}