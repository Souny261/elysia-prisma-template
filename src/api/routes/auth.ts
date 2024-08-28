import Elysia from "elysia";
import AuthController from "../controller/auth_controller";
import { loginBodySchema } from "../schema/auth_schema";
import { middleware } from "../../middleware/auth";


export const AuthRoute = new Elysia({ prefix: "/auth" })
    .post("/login", AuthController.login, {
        body: loginBodySchema,
    })
    .post("/register", AuthController.createUser)

    // Guard
    .guard({
        beforeHandle: middleware.IsAuth
    })
    .get("/whoami", AuthController.whoAmI)