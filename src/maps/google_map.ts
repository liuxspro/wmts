import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const satellite = new MapLayer(
  "Google Map - Satellite",
  "Google Map - Satellite",
  "gmap_sat",
  mercator_bbox,
  web_mercator_quad,
  "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  "image/jpeg",
);

const terrain_bg = new MapLayer(
  "Google Map - Terrain Background",
  "Google Map - Terrain Background",
  "gmap_terrain",
  mercator_bbox,
  web_mercator_quad,
  "http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&s=Ga&apistyle=s.e:l|p.v:off,s.t:1|s.e.g|p.v:off,s.t:3|s.e.g|p.v:off,s.t:2|s.e.g|p.v:off",
  "image/jpeg",
);

export const layers = [satellite, terrain_bg];

export const service: Service = {
  title: "谷歌地图",
  abstract: "谷歌地图",
  keywords: ["谷歌地图"],
};

export const cap = new Capabilities(service, layers).xml;
