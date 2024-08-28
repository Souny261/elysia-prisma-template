import { Elysia } from "elysia";
import { AuthRoute } from "./auth";

export const IndexRoute = new Elysia({ prefix: "/api" })
    .use(AuthRoute)