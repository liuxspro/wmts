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

// from https://gis.sinica.edu.tw/worldmap/
const bing_aerial = new MapLayer(
  "Bing Aerial",
  "Bing Aerial",
  "bing_aerial",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://gis.sinica.edu.tw/worldmap/file-exists.php?img=BingA-jpg-{z}-{x}-{y}",
  "image/jpeg",
);

export const layers = [bing, bing_aerial];

export const service: Service = {
  title: "Bing",
  abstract: "Bing Virtual Earth",
  keywords: ["Bing Virtual Earth"],
};

export const cap = new Capabilities(service, layers).xml;
