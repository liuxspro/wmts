import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { send } from "jsr:@oak/oak/send";

import { router as tianditu_router } from "./server/tianditu.ts";
import { router as geocloud_router } from "./server/geocloud.ts";
import { router as collection } from "./server/collection.ts";
import { router as bing } from "./server/tiles/bing.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "On Deno Deploy 💖";
});

router.get("/dist/:filename", async (ctx) => {
  const filename = ctx.params.filename; // 动态获取文件名
  await send(ctx, filename, {
    root: `${Deno.cwd()}/dist`,
  });
});

const app = new Application();
app.use(router.routes());
app.use(tianditu_router.routes());
app.use(geocloud_router.routes());
app.use(collection.routes());
app.use(bing.routes());
app.use(router.allowedMethods());

const port = 8080;

console.log(`Server runing as http://localhost:${port}`);

app.listen({ hostname: "0.0.0.0", port });
