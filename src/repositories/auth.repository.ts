import prisma from "../config/prisma";

// Finds an auth user by email for login checks.
export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
    });
}
