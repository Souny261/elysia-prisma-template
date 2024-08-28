import Elysia from "elysia"
import { cors } from "@elysiajs/cors";
import { bearer } from "@elysiajs/bearer";
import { jwt } from "@elysiajs/jwt";
import { Logestic } from 'logestic';
import { response } from "./utilities/reponse";
import { AuthorizationError } from "./exception/AuthorizationError";
import { DataNotFoundError } from "./exception/CommonError";
import { AuthenticationError } from "./exception/AuthenticationError";
export const elysiaPlugin = (app: Elysia) => app
    .use(cors())
    .use(bearer())
    .use(
        jwt({
            name: "jwt",
            secret: Bun.env.JWT_SECRET!,
            exp: "60s",
            // refreshExp: "7d",
        })
    )
    .use(
        jwt({
            name: "refreshJwt",
            secret: Bun.env.JWT_REFRESH!,
        })
    )
    .use(Logestic.preset('common'))
    .error('AUTHENTICATION_ERROR', AuthenticationError)
    .error('AUTHORIZATION_ERROR', AuthorizationError)
    .error('DATANOTFOUND_ERROR', DataNotFoundError)
    .onError(({ code, error, set }) => {
        switch (code) {
            case "VALIDATION":
                return response.ErrorResponseMessage(error.all[0].message);
            case "AUTHENTICATION_ERROR":
                set.status = 401
                return response.ErrorResponseMessage(error.message);
            case 'AUTHORIZATION_ERROR':
                set.status = 403
                return response.ErrorResponseMessage(error.message);
            case 'DATANOTFOUND_ERROR':
                set.status = 404
                return response.ErrorResponseMessage(error.message);
            case 'INTERNAL_SERVER_ERROR':
                set.status = 500
                return response.ErrorResponseMessage(error.message);
            case 'UNKNOWN':
                set.status = 500
                return response.ErrorResponseMessage("Something went wrong!");
            default:
                const errorMessage = response.ErrorPrismaResponse(set, error);
                set.status = errorMessage.status
                return response.ErrorResponseMessage(errorMessage.message);
        }
    });