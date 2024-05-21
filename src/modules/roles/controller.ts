import { FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleBody } from "./schemas";
import { createRole } from "./services";

export async function createRoleHandler(
    request: FastifyRequest<{
        Body: CreateRoleBody;
    }>,
    reply: FastifyReply
) {
    const { name, permissions, applicationId } = request.body;
    return await createRole({
        name,
        permissions,
        applicationId,
    });
}