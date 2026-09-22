import { Hono } from "hono";

import guangdong from "./guangdong.ts";

const app = new Hono();

app.on("GET", ["/", "/1.0.0/WMTSCapabilities.xml"], (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(guangdong);
});

export default app;
