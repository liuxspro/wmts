/**
 * https://shanxi.tianditu.gov.cn/map/?mode=1
 */

import shanxi_maps from "./shanxi.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const shanxi_bbox: BBox = [
  [110.22954600, 34.58395000],
  [114.56041700, 40.74364900],
];

const shanxi_layers = shanxi_maps.map((map) => {
  return new MapLayer(
    `山西 ${map.name} 年影像地图`,
    `山西 ${map.name} 年影像地图`,
    `shanxi_${map.name}`,
    shanxi_bbox,
    map.maxZoom ? cgcs2000_quad.setZoom(1, map.maxZoom) : cgcs2000_quad,
    `${map.url}&TileMatrix={z}&TileCol={x}&TileRow={y}`,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 山西",
  abstract: "天地图 山西 历史影像",
  keywords: ["天地图", "山西", "历史影像"],
};

const cap = new Capabilities(service, shanxi_layers).xml;
export default cap;
