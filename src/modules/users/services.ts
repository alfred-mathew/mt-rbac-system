import { InferInsertModel, and, eq } from "drizzle-orm";
import { roles, users, usersToRoles } from "../../db/schema";
import { db } from "../../db";
import argon2 from 'argon2';

export async function createUser(data: InferInsertModel<typeof users>) {
    const password = await argon2.hash(data.password);
    const result = await db.insert(users).values({ ...data, password }).returning({
        id: users.id,
        email: users.email,
        name: users.name,
        applicationId: users.applicationId,
    });
    return result[0];
}

export async function getUsersByApplicationId(applicationId: string) {
    return await db.select().from(users).where(eq(users.applicationId, applicationId));
}

export async function getUserByEmail({ email, applicationId }: { email: string, applicationId: string }) {
    const result = await db.select({
        id: users.id,
        email: users.email,
        name: users.name,
        applicationId: users.applicationId,
        roleId: roles.id,
        password: users.password,
        permissions: roles.permissions,
    }).from(users)
        .where(and(eq(users.email, email), eq(users.applicationId, applicationId)))
        .leftJoin(usersToRoles, and(eq(users.id, usersToRoles.userId), eq(users.applicationId, usersToRoles.applicationId)))
        .leftJoin(roles, eq(roles.id, usersToRoles.roleId));

    if (!result.length) {
        return null;
    }

    const user = result.reduce((acc, curr) => {
        if (!acc.id) {
            return {
                ...curr,
                permissions: new Set(curr.permissions),
            }
        }

        if (!curr.permissions) {
            return acc;
        }

        curr.permissions.forEach((perm) => acc.permissions.add(perm));

        return acc;
    }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

    return {
        ...user,
        permissions: Array.from(user.permissions),
    };
}

export async function assignRole({
    userId, applicationId, roleId
}: {
    userId: string,
    applicationId: string,
    roleId: string,
}) {
    const result = await db.insert(usersToRoles).values({
        userId, applicationId, roleId
    }).returning();
    return result[0];
}