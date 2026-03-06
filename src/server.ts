import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { trimTrailingSlash } from "hono/trailing-slash";

import osm from "./server/osm.ts";
import bing from "./server/tiles/bing.ts";
import esri from "./server/esri.ts";
import jl1_router from "./server/jilin1.ts";
import collection from "./server/collection.ts";
import geocloud_router from "./server/geocloud.ts";
import tianditu_router from "./server/tianditu.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
<ul>
  <li><a href="/osm"  target="_blank">osm</a></li>
  <li><a href="/esri"  target="_blank">esri</a></li>
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
app.route("/esri", esri);
app.route("/", bing);

Deno.serve(app.fetch);
