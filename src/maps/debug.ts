import {
  default_matrix,
  default_service,
  generate_capabilities,
  Layer,
  mercator_bbox,
} from "../capgen.ts";

const debug_layer: Layer = {
  title: "测试瓦片 EPSG:3857",
  abstract: "显示图块的行列号",
  id: "debug",
  bbox: mercator_bbox,
  tile_matrix_set: "WebMercatorQuad",
  url: "https://liuxspro-service.deno.dev/tile/debug/{TileMatrix}/{TileCol}/{TileRow}",
};

const debug_layer_4326: Layer = {
  title: "测试瓦片 EPSG:4326",
  abstract: "显示图块的行列号",
  id: "debug",
  bbox: [
    { lon: -180.0, lat: -85.051129 }, // 西南角 (LowerCorner)
    { lon: 180.0, lat: 85.051129 }, // 东北角 (UpperCorner)
  ],
  tile_matrix_set: "WorldCRS84Quad",
  url: "https://liuxspro-service.deno.dev/tile/debug/{TileMatrix}/{TileCol}/{TileRow}",
};

export const debug = generate_capabilities(
  default_service,
  [debug_layer, debug_layer_4326],
  [default_matrix.WorldCRS84Quad, default_matrix.WebMercatorQuad]
);
