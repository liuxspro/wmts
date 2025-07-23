import { geocloud_cap } from "../maps/geocloud.ts";
import { Hono } from "@hono/hono";

export const router = new Hono();

router.get("/", (c) => {
  const token = c.req.header("tk") || c.req.query("tk");
  if (token) {
    c.header("Content-Type", "text/xml;charset=UTF-8");
    return c.body(geocloud_cap(token));
  } else {
    return c.text("Token is required", 400);
  }
});
