import {
  generate_capabilities,
  generate_tile_matrixs,
  GeoPoint,
  MapLayer,
  Service,
  TileMatrixSet,
} from "@liuxspro/capgen";

// See https://docs.ogc.org/is/17-083r4/17-083r4.html#toc51
const WorldMercatorWGS84Quad: TileMatrixSet = {
  title: "CRS84 for the World",
  id: "WorldMercatorWGS84Quad",
  supported_crs: "EPSG:3395",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/WorldMercatorWGS84",
  tile_matrixs: generate_tile_matrixs(0, 17),
};

export const world_mercator_bbox: [GeoPoint, GeoPoint] = [
  { lon: -180.0, lat: -85.08405903 }, // 西南角 (LowerCorner)
  { lon: 180.0, lat: 85.08405903 }, // 东北角 (UpperCorner)
];

const haitu = new MapLayer(
  "船讯网 - 海图",
  "船讯网 - 海图",
  "shipxy_ht",
  world_mercator_bbox,
  "WorldMercatorWGS84Quad",
  "https://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}",
  "image/png",
);

const layers = [haitu];

export const service: Service = {
  title: "船讯网",
  abstract: "船讯网",
  keywords: ["船讯网", "海图"],
};

export const cap = generate_capabilities(service, layers, [
  WorldMercatorWGS84Quad,
]);
