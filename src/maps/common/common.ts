import common_maps from "./common.json" with { type: "json" };

import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const common_layer = common_maps.map((map) => {
  return new MapLayer(
    map.name,
    map.name,
    map.id,
    mercator_bbox,
    web_mercator_quad.setZoom(map.min_zoom, map.max_zoom),
    map.url,
    map.type,
  );
});

const service: Service = {
  title: "Collection of Basemaps",
  abstract:
    "本服务提供常用 XYZ 格式地图瓦片合集，通过标准 WMTS 接口发布，支持各类 GIS 平台调用。by liuxspro@gmail.com",
  keywords: ["XYZ", "basemaps"],
};

const cap = new Capabilities(service, common_layer).xml;
export default cap;
