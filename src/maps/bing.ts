import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const bing = new MapLayer(
  "Bing Virtual Earth",
  "Bing Virtual Earth",
  "bing",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://wmts.liuxs.pro/tile/bing/{z}/{x}/{y}",
  "image/jpeg",
);

export const layers = [bing];

export const service: Service = {
  title: "Bing Virtual Earth",
  abstract: "Bing Virtual Earth",
  keywords: ["Bing Virtual Earth"],
};

export const cap = new Capabilities(service, layers).xml;
