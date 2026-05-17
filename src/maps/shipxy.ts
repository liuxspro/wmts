import {
  Capabilities,
  MapLayer,
  Service,
  world_mercator_bbox,
  world_mercator_quad,
} from "@liuxspro/capgen";

const haitu = new MapLayer(
  "船讯网 - 海图",
  "船讯网 - 海图",
  "shipxy_ht",
  world_mercator_bbox,
  world_mercator_quad.clone().setZoom(1, 17),
  "https://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}",
  "image/png",
);

export const layers = [haitu];

export const service: Service = {
  title: "船讯网",
  abstract: "船讯网",
  keywords: ["船讯网", "海图"],
};

export const cap = new Capabilities(service, layers).xml;
