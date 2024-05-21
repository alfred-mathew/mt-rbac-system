import { z } from "zod";
import zodToJsonSchema from 'zod-to-json-schema';

const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    applicationId: z.string().uuid(),
    password: z.string().min(8),
    initialUser: z.boolean().optional(),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const createUserJsonSchema = {
    body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema")
};

const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    applicationId: z.string().uuid(),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginJsonSchema = {
    body: zodToJsonSchema(loginBodySchema, "loginBodySchema")
};

const assignRoleToUserBodySchema = z.object({
    userId: z.string().uuid(),
    applicationId: z.string().uuid(),
    roleId: z.string().uuid(),
});

export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserBodySchema>;

export const assignRoleToUserJsonSchema = {
    body: zodToJsonSchema(assignRoleToUserBodySchema, "assignRoleToUserBodySchema"),
};