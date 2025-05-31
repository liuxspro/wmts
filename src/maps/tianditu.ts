import {
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
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
  keywords: ["天地图"],
};
export const tianditu_layers: MapLayer[] = [];

Object.entries(tianditu_w).forEach(([key, value]) => {
  const format = img_format[key as keyof typeof tianditu_w];
  let matrix = web_mercator_quad;
  if (key.includes("_c")) {
    matrix = cgcs2000_quad;
  }
  tianditu_layers.push(
    new MapLayer(
      value,
      value,
      `tianditu_${key}`,
      mercator_bbox,
      matrix,
      `https://t6.tianditu.gov.cn/DataServer?T=${key}&x={x}&y={y}&l={z}`,
      format,
    ),
  );
});

export const cap = new Capabilities(service, tianditu_layers).xml;

export function tianditu_cap(token: string) {
  return new Capabilities(
    service,
    tianditu_layers.map((layer) => {
      layer.set_token("tk", token);
      return layer;
    }),
  ).xml;
}
