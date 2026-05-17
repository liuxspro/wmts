import {
  Capabilities,
  MapLayer,
  Service,
  world_mercator_bbox,
  world_mercator_quad,
} from "@liuxspro/capgen";

const yandex_sat = new MapLayer(
  "Yandex - Satellite",
  "Yandex - Satellite",
  "yandex_sat",
  world_mercator_bbox,
  world_mercator_quad.clone(),
  "https://sat02.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}",
  "image/jpeg",
);

export const layers = [yandex_sat];

export const service: Service = {
  title: "Yandex",
  abstract: "Yandex - Satellite",
  keywords: ["Yandex", "Satellite"],
};

export const cap = new Capabilities(service, layers).xml;
