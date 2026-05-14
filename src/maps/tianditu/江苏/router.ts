import { Hono } from "hono";

import 江苏 from "./江苏.ts";
import 徐州 from "./徐州.ts";

const app = new Hono();

app.get("/", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(江苏);
});

app.get("/xuzhou", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(徐州);
});

export default app;
