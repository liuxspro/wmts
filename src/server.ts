import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { router as collection } from "./server/collection.ts";
import { router as geocloud_router } from "./server/geocloud.ts";
import { router as tianditu_router } from "./server/tianditu.ts";
import { router as bing } from "./server/tiles/bing.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.html("<code>On Deno Deploy 💖</code>");
});

app.use("/dist/*", serveStatic({ root: "./" }));
app.route("/collection", collection);
app.route("/geocloud", geocloud_router);
app.route("/tianditu", tianditu_router);
app.route("/", bing);

Deno.serve(app.fetch);
