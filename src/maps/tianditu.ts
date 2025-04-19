import {
  mercator_bbox,
  MapLayer,
  generate_capabilities,
  Service,
  default_matrix,
} from "@liuxspro/capgen";

const tianditu_w = {
  vec_w: "天地图 - 矢量地图（EPSG:3857）",
  cva_w: "天地图 - 矢量注记（EPSG:3857）",
  img_w: "天地图 - 影像地图（EPSG:3857）",
  cia_w: "天地图 - 影像注记（EPSG:3857）",
  ter_w: "天地图 - 地形晕染（EPSG:3857）",
  cta_w: "天地图 - 地形注记（EPSG:3857）",
  ibo_w: "天地图 - 全球境界（EPSG:3857）",
  vec_c: "天地图 - 矢量地图（EPSG:4490）",
  cva_c: "天地图 - 矢量注记（EPSG:4490）",
  img_c: "天地图 - 影像地图（EPSG:4490）",
  cia_c: "天地图 - 影像注记（EPSG:4490）",
  ter_c: "天地图 - 地形晕染（EPSG:4490）",
  cta_c: "天地图 - 地形注记（EPSG:4490）",
  ibo_c: "天地图 - 全球境界（EPSG:4490）",
};

export const img_format = {
  vec_c: "image/png",
  cva_c: "image/png",
  img_c: "image/jpeg",
  cia_c: "image/png",
  ter_c: "image/jpeg",
  cta_c: "image/png",
  ibo_c: "image/png",
  vec_w: "image/png",
  cva_w: "image/png",
  img_w: "image/jpeg",
  cia_w: "image/png",
  ter_w: "image/jpeg",
  cta_w: "image/png",
  ibo_w: "image/png",
};

export const service: Service = {
  title: "天地图服务",
  abstract: "天地图服务",
  keywords: ["天地图", "天地图服务"],
};
export const tianditu_layers: MapLayer[] = [];

Object.entries(tianditu_w).forEach(([key, value]) => {
  const format = img_format[key as keyof typeof tianditu_w];
  let matrix_name = "WebMercatorQuad";
  if (key.includes("_c")) {
    matrix_name = "CGCS2000Quad";
  }
  tianditu_layers.push(
    new MapLayer(
      value,
      value,
      `tianditu_${key}`,
      mercator_bbox,
      matrix_name,
      `https://t6.tianditu.gov.cn/DataServer?T=${key}&x={x}&y={y}&l={z}`,
      format
    )
  );
});

export const cap = generate_capabilities(service, tianditu_layers, [
  default_matrix.WebMercatorQuad,
  default_matrix.CGCS2000,
]);
