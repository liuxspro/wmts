import { Hono } from "hono";
import { collection } from "../maps/collection.ts";

const app = new Hono();

// KVP
// ?SERVICE=WMTS&REQUEST=GetCapabilities&VERSION=1.0.0
app.get("/", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(collection);
});

// RESTful
// /1.0.0/WMTSCapabilities.xml
app.get("/1.0.0/WMTSCapabilities.xml", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(collection);
});

export default app;
