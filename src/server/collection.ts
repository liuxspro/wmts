import { Hono } from "@hono/hono";
import { collection } from "../maps/collection.ts";

export const router = new Hono();

router.get("/", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(collection);
});
