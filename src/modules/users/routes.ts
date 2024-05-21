import { FastifyInstance } from "fastify";
import { AssignRoleToUserBody, assignRoleToUserJsonSchema, createUserJsonSchema, loginJsonSchema } from "./schemas";
import { assignRoleToUserHandler, createUserHandler, loginHandler } from "./controller";
import { PERMISSIONS } from "../../config/permissions";

export async function routes(app: FastifyInstance) {
    app.post('/', { schema: createUserJsonSchema }, createUserHandler);
    app.post('/login', { schema: loginJsonSchema }, loginHandler);
    app.post<{ Body: AssignRoleToUserBody }>(
        '/assign-role',
        {
            schema: assignRoleToUserJsonSchema,
            preHandler: app.guard.scope(PERMISSIONS["users:roles:write"]),
        }, assignRoleToUserHandler);
}