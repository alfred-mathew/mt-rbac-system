import { FastifyInstance } from "fastify";
import { CreateRoleBody, createRoleJsonSchema } from "./schemas";
import { createRoleHandler } from "./controller";
import { PERMISSIONS } from "../../config/permissions";

export async function routes(app: FastifyInstance) {
    app.post<{
        Body: CreateRoleBody,
    }>(
        "/",
        {
            schema: createRoleJsonSchema,
            preHandler: app.guard.scope(PERMISSIONS["roles:write"]),
        },
        createRoleHandler
    );
}