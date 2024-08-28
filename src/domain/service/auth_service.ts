import { Context, InternalServerError } from "elysia";
import { AuthenticationError } from "../../exception/AuthenticationError";
import { LoginEntity, LoginResponse, TokenEntity, UserEntity } from "../entities/auth_entity";
import { AuthRepository } from "../repositories/auth_repository";
import { User } from "@prisma/client";
import { DataNotFoundError } from "../../exception/CommonError";
import { CryptoUtil } from "../../utilities/encryption";
import { middleware } from "../../middleware/auth";
interface AuthService {
    login(ctx: Context, requerst: LoginEntity): Promise<LoginResponse>
    createUser(user: UserEntity): Promise<UserEntity>
    whoAmI(id: number): Promise<UserEntity>
}

export const AuthService: AuthService = {
    login: async function (ctx: Context, requerst: LoginEntity): Promise<LoginResponse> {
        const user = await AuthRepository.userByEmail(requerst.email);
        if (!user) {
            throw new AuthenticationError('The email address or password you entered is incorrect')
        }
        let hashpassword = CryptoUtil.encryptData(requerst.password)
        if (user.password == hashpassword) {
            const token = await middleware.GenerateToken(ctx, user.id)
            const userEntity: UserEntity = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            };
            const tokenEntity: TokenEntity = {
                access_token: token.data.access_token,
                refresh_token: token.data.refresh_token
            }
            const result: LoginResponse = { user: userEntity, token: tokenEntity }
            return result;
        } else {
            throw new AuthenticationError('The email address or password you entered is incorrect');
        }
    },
    createUser: async function (user: UserEntity): Promise<UserEntity> {
        let hashpassword = CryptoUtil.encryptData(user.password!);
        const userPayload: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: hashpassword,
            createdAt: new Date(),
        };
        const createdUser = await AuthRepository.createUser(userPayload);
        if (createdUser) {
            const userEntity: UserEntity = {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                createdAt: createdUser.createdAt
            };
            return userEntity;
        } else {
            throw new InternalServerError("Failed to create user");
        }
    },
    whoAmI: async function (id: number): Promise<UserEntity> {
        const user = await AuthRepository.whoAmI(id);
        if (user) {
            const userEntity: UserEntity = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            };
            return userEntity;
        } else {
            throw new DataNotFoundError("Failed to get user");
        }
    }
}