import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { trimTrailingSlash } from "hono/trailing-slash";
import collection from "./server/collection.ts";
import { router as geocloud_router } from "./server/geocloud.ts";
import { router as tianditu_router } from "./server/tianditu.ts";
import { router as jl1_router } from "./server/jilin1.ts";
import bing from "./server/tiles/bing.ts";
import osm from "./server/osm.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
<ul>
  <li><a href="/osm"  target="_blank">osm</a></li>
  <li><a href="/collection"  target="_blank">wmts map collection</a></li>
</ul>
<div style="
  text-align: center;
  position: fixed;
  bottom: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
">
  <code>On Deno Deploy 💖</code>
</div>

`);
});

app.use("/dist/*", serveStatic({ root: "./" }));
app.use(trimTrailingSlash());

app.route("/collection", collection);
app.route("/geocloud", geocloud_router);
app.route("/tianditu", tianditu_router);
app.route("/jl1", jl1_router);
app.route("/osm", osm);
app.route("/", bing);

Deno.serve(app.fetch);
