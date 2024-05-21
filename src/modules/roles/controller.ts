import { FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleBody } from "./schemas";
import { createRole } from "./services";

export async function createRoleHandler(
    request: FastifyRequest<{
        Body: CreateRoleBody;
    }>,
    reply: FastifyReply
) {
    const user = request.user;
    const { name, permissions } = request.body;
    return await createRole({
        name,
        permissions,
        applicationId: user.applicationId,
    });
}