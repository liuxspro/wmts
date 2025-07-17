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

// from Carto
// https://basemaps.cartocdn.com/
const carto_voyager = new MapLayer(
  "Carto - Voyager (nolabels)",
  "Carto - Voyager (nolabels)",
  "carto_voyager",
  mercator_bbox,
  web_mercator_quad_hd.clone(),
  "https://basemaps.cartocdn.com/rastertiles/voyager_no_labels_no_buildings/{z}/{x}/{y}@2x.png",
  "image/png",
);

const carto_light = new MapLayer(
  "Carto - Light (nolabels)",
  "Carto - Light (nolabels)",
  "carto_light",
  mercator_bbox,
  web_mercator_quad_hd.clone(),
  "https://basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
  "image/png",
);

const carto_dark = new MapLayer(
  "Carto - Dark (nolabels)",
  "Carto - Dark (nolabels)",
  "carto_dark",
  mercator_bbox,
  web_mercator_quad_hd.clone(),
  "https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
  "image/png",
);

const carto = [carto_voyager, carto_light, carto_dark];

const windy_dark = new MapLayer(
  "Windy - Darkmap",
  "Windy - Darkmap",
  "windy_dark",
  mercator_bbox,
  web_mercator_quad_hd.clone().setZoom(1, 11),
  "https://tiles.windy.com/tiles/v10.0/darkmap-retina/{z}/{x}/{y}.png",
  "image/png",
);

export const layers = [osm, osm_de, osmand, f4map_2d, ...carto, windy_dark];

export const service: Service = {
  title: "OpenStreetMap",
  abstract: "OpenStreetMap WMTS",
  keywords: ["OpenStreetMap", "osm"],
};

export const cap = new Capabilities(service, layers).xml;
