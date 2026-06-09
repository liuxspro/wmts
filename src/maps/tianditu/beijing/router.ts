import { Hono } from "hono";

import beijing from "./beijing.ts";

const app = new Hono();

app.on("GET", ["/", "/1.0.0/WMTSCapabilities.xml"], (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(beijing);
});

export default app;
