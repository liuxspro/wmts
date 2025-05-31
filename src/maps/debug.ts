import {
  Capabilities,
  default_service,
  MapLayer,
  mercator_bbox,
  web_mercator_quad,
  world_crs84_quad,
} from "@liuxspro/capgen";

const debug_layer = new MapLayer(
  "测试瓦片 EPSG:3857",
  "显示图块的行列号",
  "debug3857",
  mercator_bbox,
  web_mercator_quad,
  "https://liuxspro-service.deno.dev/tile/debug/{z}/{x}/{y}",
  "image/png",
);

const debug_layer_4326 = new MapLayer(
  "测试瓦片 EPSG:4326",
  "显示图块的行列号",
  "debug4326",
  mercator_bbox,
  world_crs84_quad,
  "https://liuxspro-service.deno.dev/tile/debug/{z}/{x}/{y}",
  "image/png",
);

export const debug = new Capabilities(
  default_service,
  [debug_layer, debug_layer_4326],
).xml;
