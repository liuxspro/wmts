import {
  default_matrix,
  default_service,
  generate_capabilities,
  MapLayer,
  mercator_bbox,
} from "@liuxspro/capgen";

const debug_layer = new MapLayer(
  "测试瓦片 EPSG:3857",
  "显示图块的行列号",
  "debug3857",
  mercator_bbox,
  "WebMercatorQuad",
  "https://liuxspro-service.deno.dev/tile/debug/{z}/{x}/{y}",
  "image/png"
);

const debug_layer_4326 = new MapLayer(
  "测试瓦片 EPSG:4326",
  "显示图块的行列号",
  "debug4326",
  mercator_bbox,
  "WorldCRS84Quad",
  "https://liuxspro-service.deno.dev/tile/debug/{z}/{x}/{y}",
  "image/png"
);

export const debug = generate_capabilities(
  default_service,
  [debug_layer, debug_layer_4326],
  [default_matrix.WorldCRS84Quad, default_matrix.WebMercatorQuad]
);
