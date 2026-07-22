/**
 * https://henan.tianditu.gov.cn/map/Multitemporal
 */

import henan_maps from "./henan.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const henan_bbox: BBox = [
  [110.35367600, 31.38445900],
  [116.64701100, 36.37418400],
];

const henan_layers = henan_maps.map((map) => {
  return new MapLayer(
    `河南 ${map.time} 影像地图`,
    `河南 ${map.time} 影像地图`,
    map.layer,
    henan_bbox,
    cgcs2000_quad,
    map.tileurl,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 河南",
  abstract: "天地图 河南 历史影像",
  keywords: ["天地图", "河南", "历史影像"],
};

const cap = new Capabilities(service, henan_layers).xml;
export default cap;
