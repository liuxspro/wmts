import hunan_maps from "./hunan.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const js_bbox: BBox = [
  [108.78311200, 24.63442600],
  [114.25410500, 30.12800600],
];

const hn_layers = hunan_maps.map((map) => {
  return new MapLayer(
    `湖南 ${map.name}`,
    `湖南 ${map.name}`,
    `${map.id}`,
    js_bbox,
    cgcs2000_quad,
    map.tileUrl,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 湖南",
  abstract: "天地图 湖南 历史影像",
  keywords: ["天地图", "湖南苏", "历史影像"],
};

const cap = new Capabilities(service, hn_layers).xml;
export default cap;
