import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { trimTrailingSlash } from "hono/trailing-slash";

import bing from "./server/tiles/bing.ts";
import jl1_router from "./server/jilin1.ts";
import geocloud_router from "./server/geocloud.ts";
import tianditu_router from "./server/tianditu.ts";
import {
  collection_router,
  esri_router,
  hubgs_router,
  osm_router,
} from "./server/router.ts";
import test from "./server/test.ts";

const app = new Hono();

const HTML = await Deno.readTextFile(new URL("./index.html", import.meta.url));

app.get("/", (c) => c.html(HTML));

app.use("/dist/*", serveStatic({ root: "./" }));
app.use(trimTrailingSlash());

app.route("/collection", collection_router);
app.route("/geocloud", geocloud_router);
app.route("/hubgs", hubgs_router);
app.route("/tianditu", tianditu_router);
app.route("/jl1", jl1_router);
app.route("/osm", osm_router);
app.route("/esri", esri_router);
app.route("/", bing);
app.route("/test", test);

Deno.serve(app.fetch);
