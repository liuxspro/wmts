import {
  default_matrix,
  generate_capabilities,
  MapLayer,
  mercator_bbox,
  default_service,
} from "@liuxspro/capgen";

const HOST = "https://wprd02.is.autonavi.com";

const satellite = new MapLayer(
  "高德 - 卫星影像 (GCJ02)",
  "高德 - 卫星影像 (GCJ02)，有偏移",
  "amap_sat",
  mercator_bbox,
  "WebMercatorQuad",
  `${HOST}/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}`,
  "image/jpeg"
);

const street = new MapLayer(
  "高德 - 矢量地图 (GCJ02)",
  "高德 - 矢量地图 (GCJ02)，有偏移",
  "amap_str",
  mercator_bbox,
  "WebMercatorQuad",
  `${HOST}/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}`,
  "image/png"
);

const annotes = new MapLayer(
  "高德 - 矢量注记 (GCJ02)",
  "高德 - 矢量注记 (GCJ02)，有偏移",
  "amap_ann",
  mercator_bbox,
  "WebMercatorQuad",
  `${HOST}/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
  "image/png"
);

const layers: MapLayer[] = [satellite, street, annotes];

export const cap = generate_capabilities(default_service, layers, [
  default_matrix.WebMercatorQuad,
]);
