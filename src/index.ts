import { Elysia } from "elysia";
import { IndexRoute } from "./api/routes";
import { elysiaPlugin } from "./plugin";

// Initialize Elysia app
const app = new Elysia()
  .use(elysiaPlugin)
  .use(IndexRoute);

app.listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
