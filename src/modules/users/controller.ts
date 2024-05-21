import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, LoginBody } from "./schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { assignRole, createUser, getUserByEmail, getUsersByApplicationId } from "./services";
import { getRoleByName } from "../roles/services";
import jwt from 'jsonwebtoken';
import { env } from "../../config/env";
import { logger } from "../../logger";

export async function createUserHandler(request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) {
    const { initialUser, ...data } = request.body;
    const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;

    if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
        const users = await getUsersByApplicationId(data.applicationId);
        if (users.length > 0) {
            return reply.code(400).send({
                message: "Application already has an admin user",
                extensions: {
                    code: 'ADMIN_USER_EXISTS',
                    applicationId: data.applicationId,
                },
            });
        }
    }

    const role = await getRoleByName({
        name: roleName,
        applicationId: data.applicationId,
    });

    if (!role) {
        return reply.code(404).send({
            message: 'Role not found',
        });
    }

    try {
        const user = await createUser(data);
        await assignRole({
            userId: user.id,
            applicationId: data.applicationId,
            roleId: role.id,
        })
    } catch (err) {

    }
}

export async function loginHandler(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    const { email, applicationId, password } = request.body;
    const user = await getUserByEmail({ email, applicationId });
    if (!user) {
        return reply.code(404).send({
            message: "No user with given email and application id exists",
            email,
            applicationId,
        });
    }

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        applicationId: user.applicationId,
        scopes: user.permissions
    }, env.SIGNING_SECRET);

    return { token };
}


export async function assignRoleToUserHandler(
    request: FastifyRequest<{
        Body: AssignRoleToUserBody;
    }>,
    reply: FastifyReply
) {
    const applicationId = request.user.applicationId;
    const { userId, roleId } = request.body;

    try {
        const result = await assignRole({
            userId,
            applicationId,
            roleId,
        });

        return result;
    } catch (e) {
        logger.error(e, `Error assigning role to user`);
        return reply.code(400).send({
            message: 'Could not assign role to user',
        });
    }
}