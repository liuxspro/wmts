/**
 * 广东省天地图 资源中心
 * https://guangdong.tianditu.gov.cn/GeoResourceCenter/index.html
 */

import {
  Capabilities,
  cgcs2000_quad,
  GeoPoint,
  MapLayer,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

import gd_maps from "./guangdong.json" with { type: "json" };
interface GDMap {
  key: string;
  name: string;
  minZoom: number;
  maxZoom: number;
  crs: string;
}

const service: Service = {
  title: "天地图 广东",
  abstract: "天地图 广东 历史影像",
  keywords: ["天地图", "广东", "历史影像"],
};

const gd_bbox: [GeoPoint, GeoPoint] = [
  [106.875, 19.3111], // 西南角 (LowerCorner)
  [118.125, 27.0591], // 东北角 (UpperCorner)
];

const host = "https://guangdong.tianditu.gov.cn/geostar";

export const gd_layers = gd_maps.map((map: GDMap) => {
  return new MapLayer(
    map.name,
    map.name,
    map.key,
    gd_bbox,
    map.crs === "web_mercator"
      ? web_mercator_quad.clone().setZoom(map.minZoom, map.maxZoom)
      : cgcs2000_quad.clone().setZoom(map.minZoom, map.maxZoom),
    `${host}/${map.key}/DataServer?l={z}&x={x}&y={y}`,
    "image/png",
  );
});

const cap = new Capabilities(service, gd_layers).xml;
export default cap;
