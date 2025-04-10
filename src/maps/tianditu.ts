import {
  mercator_bbox,
  MapLayer,
  generate_capabilities,
  Service,
  default_matrix,
} from "../capgen.ts";

const tianditu_w = {
  vec_w: "天地图 - 矢量地图（EPSG:3857）",
  cva_w: "天地图 - 矢量注记（EPSG:3857）",
  img_w: "天地图 - 影像地图（EPSG:3857）",
  cia_w: "天地图 - 影像注记（EPSG:3857）",
  ter_w: "天地图 - 地形晕染（EPSG:3857）",
  cta_w: "天地图 - 地形注记（EPSG:3857）",
  ibo_w: "天地图 - 全球境界（EPSG:3857）",
};

const tianditu_c = {
  vec_c: "天地图 - 矢量地图（EPSG:4490）",
  cva_c: "天地图 - 矢量注记（EPSG:4490）",
  img_c: "天地图 - 影像地图（EPSG:4490）",
  cia_c: "天地图 - 影像注记（EPSG:4490）",
  ter_c: "天地图 - 地形晕染（EPSG:4490）",
  cta_c: "天地图 - 地形注记（EPSG:4490）",
  ibo_c: "天地图 - 全球境界（EPSG:4490）",
};

export const service: Service = {
  title: "天地图服务",
  abstract: "天地图服务",
  keywords: ["天地图", "天地图服务"],
};
const tianditu_w_layers: MapLayer[] = [];

Object.entries(tianditu_w).forEach(([key, value]) => {
  tianditu_w_layers.push(
    new MapLayer(
      value,
      value,
      `tianditu_${key}`,
      mercator_bbox,
      "WebMercatorQuad",
      `https://t6.tianditu.gov.cn/DataServer?T=${key}&x={x}&y={y}&l={z}`
    )
  );
});

const tianditu_c_layers: MapLayer[] = [];

Object.entries(tianditu_c).forEach(([key, value]) => {
  tianditu_w_layers.push(
    new MapLayer(
      value,
      value,
      `tianditu_${key}`,
      mercator_bbox,
      "CGCS2000Quad",
      `https://t6.tianditu.gov.cn/DataServer?T=${key}&x={x}&y={y}&l={z}`
    )
  );
});

export const tianditu_layers = [...tianditu_w_layers, ...tianditu_c_layers];

export const cap = generate_capabilities(service, tianditu_layers, [
  default_matrix.WebMercatorQuad,
  default_matrix.CGCS2000,
]);
