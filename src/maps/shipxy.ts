import {
  Capabilities,
  GeoPoint,
  MapLayer,
  Service,
  world_mercator_quad,
} from "@liuxspro/capgen";

export const world_mercator_bbox: [GeoPoint, GeoPoint] = [
  { lon: -180.0, lat: -85.08405903 }, // 西南角 (LowerCorner)
  { lon: 180.0, lat: 85.08405903 }, // 东北角 (UpperCorner)
];

const haitu = new MapLayer(
  "船讯网 - 海图",
  "船讯网 - 海图",
  "shipxy_ht",
  world_mercator_bbox,
  world_mercator_quad.clone().setZoom(1, 17),
  "https://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}",
  "image/png",
);

const layers = [haitu];

export const service: Service = {
  title: "船讯网",
  abstract: "船讯网",
  keywords: ["船讯网", "海图"],
};

export const cap = new Capabilities(service, layers).xml;
