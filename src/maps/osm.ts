/**
 * See https://wiki.openstreetmap.org/wiki/Raster_tile_providers
 */

import {
  default_matrix,
  default_service,
  generate_capabilities,
  MapLayer,
  mercator_bbox,
} from "@liuxspro/capgen";

// OpenStreetMap's Standard tile layer
const osm = new MapLayer(
  "OpenStreetMap",
  "OpenStreetMap's Standard tile layer",
  "osm_std",
  mercator_bbox,
  "WebMercatorQuad",
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  "image/png",
);

// German fork of the Standard tile layer
const osm_de = new MapLayer(
  "OpenStreetMap(German fork)",
  "German fork of the Standard tile layer",
  "osm_std",
  mercator_bbox,
  "WebMercatorQuad",
  "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  "image/png",
);

export const layers = [osm, osm_de];

export const cap = generate_capabilities(default_service, layers, [
  default_matrix.WebMercatorQuad,
]);
