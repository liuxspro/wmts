import {
  Capabilities,
  GeoPoint,
  MapLayer,
  Service,
  world_crs84_quad,
} from "@liuxspro/capgen";

const H49C001002_bbox: [GeoPoint, GeoPoint] = [
  [109.488208, 32.010468], // 西南角 (LowerCorner)
  [111.005311, 30.994445], // 东北角 (UpperCorner)
];

const I49C004003_bbox: [GeoPoint, GeoPoint] = [
  [110.985680, 33.013289],
  [112.510033, 31.997054],
];

const H49C001002 = new MapLayer(
  "1：25万地质图空间数据库神农架幅（H49C001002）",
  "1：25万地质图空间数据库神农架幅（H49C001002）",
  "H49C001002",
  H49C001002_bbox,
  world_crs84_quad.clone().setZoom(3, 16),
  "https://geocloud.hubgs.com/api/igs/rest/ogc/WMTSServer?layer=WMTS020101010007012&style=default&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
  "image/png",
);

const I49C004003 = new MapLayer(
  "1：25万襄樊市幅（I49C004003）地质图",
  "1：25万襄樊市幅（I49C004003）地质图",
  "I49C004003",
  I49C004003_bbox,
  world_crs84_quad.clone().setZoom(3, 16),
  "https://geocloud.hubgs.com/api/igs/rest/ogc/WMTSServer?layer=WMTS020101010007024&style=default&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}",
  "image/png",
);

export const service: Service = {
  title: "湖北省地质局 地质一张图",
  abstract: "湖北省地质局 地质一张图 By liuxspro@gmail.com",
  keywords: ["湖北省地质局"],
};

export const cap = new Capabilities(service, [H49C001002, I49C004003]).xml;
export default cap;
