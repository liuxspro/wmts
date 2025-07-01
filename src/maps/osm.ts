/**
 * See https://wiki.openstreetmap.org/wiki/Raster_tile_providers
 */

import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
  web_mercator_quad_hd,
} from "@liuxspro/capgen";

// OpenStreetMap's Standard tile layer
const osm = new MapLayer(
  "OpenStreetMap Standard",
  "OpenStreetMap's Standard tile layer",
  "osm_std",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  "image/png",
);

// German fork of the Standard tile layer
const osm_de = new MapLayer(
  "OpenStreetMap Standard (German fork)",
  "German fork of the Standard tile layer",
  "osm_de",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  "image/png",
);

// from OsmAnd
// https://osmand.net/docs/user/map/raster-maps/
const osmand = new MapLayer(
  "OpenStreetMap Standard HD (OsmAnd 512px)",
  "OsmAnd tile layer",
  "osm_and",
  mercator_bbox,
  web_mercator_quad_hd.clone(),
  "https://tile.osmand.net/hd/{z}/{x}/{y}.png",
  "image/png",
);

// from F4map
// https://www.f4map.com
const f4map_2d = new MapLayer(
  "F4map - 2D",
  "F4map - 2D",
  "osm_f4map_2d",
  mercator_bbox,
  web_mercator_quad_hd.clone(),
  "https://tile.f4map.com/tiles/f4_2d/{z}/{x}/{y}.png",
  "image/png",
);

export const layers = [osm, osm_de, osmand, f4map_2d];

export const service: Service = {
  title: "OpenStreetMap",
  abstract: "OpenStreetMap WMTS",
  keywords: ["OpenStreetMap", "osm"],
};

export const cap = new Capabilities(service, layers).xml;
