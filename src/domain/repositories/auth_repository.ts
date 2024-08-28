import { User } from "@prisma/client";
import prisma from "../../adapter/database";


interface AuthRepository {
    user(email: string, password: string): Promise<User | null>;
    userByEmail(email: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    whoAmI(id: number): Promise<User | null>;
}

export const AuthRepository: AuthRepository = {
    user: async function (email: string, password: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                password: password,
            },
        });
        return user;
    },
    userByEmail: async function (email: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        return user;
    },
    createUser: async function (user: User): Promise<User> {
        const createdUser = await prisma.user.create({ data: user });
        return createdUser;
    },
    whoAmI: async function (id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            }
        });
        return user;
    }
}

// async user(email: string, password: string): Promise < User | null > {
//     const user = await db.user.findFirst({
//         where: {
//             email: email,
//             password: password,
//         },
//     });
//     return user;
// }

// async userByEmail(email: string): Promise < User | null > {
//     const user = await db.user.findFirst({
//         where: {
//             email: email,
//         },
//     });
//     return user;
// }

// async createUser(user: User): Promise < User > {
//     const createdUser = await db.user.create({ data: user });
//     return createdUser;
// }