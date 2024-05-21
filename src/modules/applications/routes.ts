import { FastifyInstance } from "fastify";
import { createApplicationJsonSchema } from "./schemas";
import { createApplicationHandler } from "./controllers";

export async function routes(app: FastifyInstance) {
    app.post('/', { schema: createApplicationJsonSchema }, createApplicationHandler);
    app.get('/', () => { });
}