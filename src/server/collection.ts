import { Hono } from "hono";
import { collection } from "../maps/collection.ts";

const app = new Hono();

app.get("/", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(collection);
});

export default app;
