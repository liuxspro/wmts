import { Hono } from "hono";
import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
  world_crs84_quad,
  world_crs84_quad_less,
} from "@liuxspro/capgen";

const app = new Hono();
const service: Service = {
  title: "Debug Tiles",
  abstract: "Debug Tiles",
  keywords: ["Debug"],
};

app.get("/4326", (c) => {
  // let url = c.req.url.split("url=")[1];
  const url = c.req.query("url");
  const less = c.req.query("less");
  const name = c.req.query("name");
  // url = url.replace("%7Bz%7D", "{z}")
  //   .replace("%7Bx%7D", "{x}")
  //   .replace("%7By%7D", "{y}")
  //   .replace("&SERVICE=WMS&REQUEST=GetCapabilities", "");
  if (!url) return c.body("url is required");
  const quad = less ? world_crs84_quad_less.clone() : world_crs84_quad.clone();
  const title = name ?? "测试瓦片 EPSG:4326";
  const normalized_title = title.replace("/1.0.0/WMTSCapabilities.xml", "");
  const test_layer = new MapLayer(
    normalized_title,
    normalized_title,
    "debug4326",
    mercator_bbox,
    quad,
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
  // const url = c.req.url.split("url=")[1];
  const url = c.req.query("url");
  if (!url) return c.body("url is required");
  const name = c.req.query("name");
  const title = name ?? "测试瓦片 EPSG:3857";
  const normalized_title = title.replace("/1.0.0/WMTSCapabilities.xml", "");

  const test_layer = new MapLayer(
    normalized_title,
    normalized_title,
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
