import Elysia, { Context } from "elysia"
import { ApiResponse, response } from "../../utilities/reponse"
import { LoginEntity, UserEntity } from "../../domain/entities/auth_entity";
import { AuthService } from "../../domain/service/auth_service";
import { AuthenticationError } from "../../exception/AuthenticationError";
import { middleware } from "../../middleware/auth";

interface AuthController {
    login(ctx: Context): Promise<ApiResponse<any>>
    createUser(ctx: Context): Promise<ApiResponse<any>>
    whoAmI(ctx: Context): Promise<ApiResponse<any>>
}

const AuthController: AuthController = {
    login: async function async(ctx: Context): Promise<ApiResponse<any>> {
        const body = ctx.body as LoginEntity;
        const result = await AuthService.login(ctx, body);
        return response.SuccessResponse(result);
    },
    createUser: async function (ctx: Context): Promise<ApiResponse<any>> {
        const body = ctx.body as UserEntity;
        const result = await AuthService.createUser(body);
        return response.SuccessResponse(result);
    },
    whoAmI: async function (ctx: Context): Promise<ApiResponse<any>> {
        const userID = await middleware.GetUserFromToken(ctx)
        const result = await AuthService.whoAmI(userID);
        return response.SuccessResponse(result);
    }
}

export default AuthController
