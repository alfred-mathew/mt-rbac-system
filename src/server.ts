import fastify from "fastify";
import guard from 'fastify-guard';
import { logger } from "./logger";
import { routes as applicationRoutes } from "./modules/applications/routes";
import { routes as userRoutes } from "./modules/users/routes";
import { routes as roleRoutes } from "./modules/roles/routes";
import jwt from 'jsonwebtoken';
import { env } from "./config/env";

type User = {
    id: string;
    applicationId: string;
    scopes: Array<string>;
};

declare module "fastify" {
    interface FastifyRequest {
        user: User;
    }
}

export async function buildServer() {
    const serverOpts = {
        logger,
    };
    const app = fastify(serverOpts);

    app.decorateRequest("user", null);

    app.addHook("onRequest", async function (request, reply) {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return;
        }

        try {
            const token = authHeader.replace("Bearer ", "");
            const user = jwt.verify(token, env.SIGNING_SECRET) as User;
            logger.debug("user", user);
            request.user = user;
        } catch (e) { }
    });

    app.register(guard, {
        requestProperty: "user",
        scopeProperty: "scopes",
        errorHandler: (result, request, reply) => {
            return reply.send({ message: "You are not authorized to perform this action" });
        }
    });

    app.register(applicationRoutes, { prefix: '/api/applications' });
    app.register(userRoutes, { prefix: '/api/users' });
    app.register(roleRoutes, { prefix: '/api/roles' });
    return app;
}