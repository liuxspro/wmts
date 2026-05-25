import { Hono } from "hono";
import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
  world_crs84_quad,
} from "@liuxspro/capgen";

const app = new Hono();
const service: Service = {
  title: "Debug Tiles",
  abstract: "Debug Tiles",
  keywords: ["Debug"],
};

app.get("/4326", (c) => {
  let url = c.req.url.split("url=")[1];
  url = url.replace("%7Bz%7D", "{z}")
    .replace("%7Bx%7D", "{x}")
    .replace("%7By%7D", "{y}");
  const test_layer = new MapLayer(
    "测试瓦片 EPSG:4326",
    "测试瓦片WMTS 4326",
    "debug4326",
    mercator_bbox,
    world_crs84_quad.clone(),
    url,
    "image/jpeg",
  );
  const cap = new Capabilities(
    service,
    [test_layer],
  ).xml;

  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(cap);
});

app.get("/3857", (c) => {
  const url = c.req.url.split("url=")[1];
  const test_layer = new MapLayer(
    "测试瓦片 EPSG:3857",
    "测试瓦片WMTS 3857",
    "debug3857",
    mercator_bbox,
    web_mercator_quad.clone(),
    url,
    "image/jpeg",
  );
  const cap = new Capabilities(
    service,
    [test_layer],
  ).xml;

  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(cap);
});

export default app;
