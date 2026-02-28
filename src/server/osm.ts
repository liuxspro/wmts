import { Hono } from "hono";
import osm from "../maps/osm.ts";

const app = new Hono();

/**
 * RESTful /1.0.0/WMTSCapabilities.xml
 * KVP ?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0
 */
app.on("GET", ["/", "/1.0.0/WMTSCapabilities.xml"], (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(osm);
});

export default app;
