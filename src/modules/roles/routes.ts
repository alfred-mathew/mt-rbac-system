import { FastifyInstance } from "fastify";
import { CreateRoleBody, createRoleJsonSchema } from "./schemas";
import { createRoleHandler } from "./controller";

export async function routes(app: FastifyInstance) {
    app.post<{
        Body: CreateRoleBody;
    }>(
        "/",
        {
            schema: createRoleJsonSchema
        },
        createRoleHandler
    );
}