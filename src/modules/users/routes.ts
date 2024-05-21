import { FastifyInstance } from "fastify";
import { assignRoleToUserJsonSchema, createUserJsonSchema, loginJsonSchema } from "./schemas";
import { assignRoleToUserHandler, createUserHandler, loginHandler } from "./controller";

export async function routes(app: FastifyInstance) {
    app.post('/', { schema: createUserJsonSchema }, createUserHandler);
    app.post('/login', { schema: loginJsonSchema }, loginHandler);
    app.post('/assign-role', { schema: assignRoleToUserJsonSchema }, assignRoleToUserHandler);
}