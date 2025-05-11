/**
 * See https://wiki.openstreetmap.org/wiki/Raster_tile_providers
 */

import {
  default_matrix,
  generate_capabilities,
  MapLayer,
  mercator_bbox,
  Service,
} from "@liuxspro/capgen";

// OpenStreetMap's Standard tile layer
const osm = new MapLayer(
  "OpenStreetMap Standard",
  "OpenStreetMap's Standard tile layer",
  "osm_std",
  mercator_bbox,
  "WebMercatorQuad",
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  "image/png",
);

// German fork of the Standard tile layer
const osm_de = new MapLayer(
  "OpenStreetMap Standard(German fork)",
  "German fork of the Standard tile layer",
  "osm_de",
  mercator_bbox,
  "WebMercatorQuad",
  "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  "image/png",
);

export const layers = [osm, osm_de];

export const service: Service = {
  title: "OpenStreetMap",
  abstract: "OpenStreetMap WMTS",
  keywords: ["OpenStreetMap", "osm"],
};

export const cap = generate_capabilities(service, layers, [
  default_matrix.WebMercatorQuad,
]);
