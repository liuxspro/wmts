/**
 * https://hebei.tianditu.gov.cn/map1/#/home/dsx
 */

import hebei_maps from "./hebei.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const hebei_bbox: BBox = [
  [113.45870200, 36.04631800],
  [119.84668700, 42.61476900],
];

const hebei_layers = hebei_maps.map((map) => {
  return new MapLayer(
    `河北 ${map.name} 年影像地图`,
    `河北 ${map.name} 年影像地图`,
    `hehei_${map.name}`,
    hebei_bbox,
    map.maxZoom ? cgcs2000_quad.setZoom(1, map.maxZoom) : cgcs2000_quad,
    `${map.url}&tilematrix={z}&tilerow={y}&tilecol={x}`,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 河北",
  abstract: "天地图 河北 历史影像",
  keywords: ["天地图", "河北", "历史影像"],
};

const cap = new Capabilities(service, hebei_layers).xml;
export default cap;
