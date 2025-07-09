/**
 * See https://thematic.geoq.cn/arcgis/rest/services
 */

import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const geoq_gray = new MapLayer(
  "GeoQ - 灰色中国基础地图 (GCJ02)",
  "灰色中文不含兴趣点版中国基础地图 (GCJ02)",
  "geoq_gray",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://thematic.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer/WMTS/tile/1.0.0/ChinaOnlineStreetGray/default/GoogleMapsCompatible/{z}/{y}/{x}.png",
  "image/png",
);

const geoq_hydro = new MapLayer(
  "GeoQ - 水系图 (GCJ02)",
  "水系图 (GCJ02)",
  "geoq_hydro",
  mercator_bbox,
  web_mercator_quad.clone().setZoom(1, 13),
  "https://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/WMTS/tile/1.0.0/ThematicMaps_WorldHydroMap/default/GoogleMapsCompatible/{z}/{y}/{x}.png",
  "image/png",
);

export const layers = [geoq_gray, geoq_hydro];

export const service: Service = {
  title: "GeoQ",
  abstract: "GeoQ 底图",
  keywords: ["GeoQ"],
};

export const cap = new Capabilities(service, layers).xml;
