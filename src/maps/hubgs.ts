import {
  Capabilities,
  GeoPoint,
  MapLayer,
  Service,
  world_crs84_quad,
} from "@liuxspro/capgen";

const BASE = "https://geocloud.hubgs.com/api/igs/rest/ogc/WMTSServer";

const tilesets = [
  {
    id: "WMTS020101010007012",
    code: "H49C001002",
    title: "1：25万神农架幅（H49C001002）地质图",
    bbox: [[109.488208, 32.010468], [111.005311, 30.994445]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007024",
    code: "I49C004003",
    title: "1：25万襄樊市幅（I49C004003）地质图",
    bbox: [[110.985680, 33.013289], [112.510033, 31.997054]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007009",
    code: "H50C001001",
    title: "1：25万麻城市幅（H50C001001）地质图",
    bbox: [[113.991299, 32.030398], [115.512905, 30.994936]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007003",
    code: "H49C001003",
    title: "1：25万荆门市幅（H49C001003）地质图",
    bbox: [[110.983344, 32.024480], [112.510444, 30.997259]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007021",
    code: "I49C004002",
    title: "1：25万十堰市幅（I49C004002）地质图",
    bbox: [[109.486858, 33.013723], [111.011211, 31.994741]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007018",
    code: "H49C002003",
    title: "1：25万宜昌市幅（H49C002003）地质图",
    bbox: [[110.965791, 31.040057], [112.542329, 29.979876]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007015",
    code: "H49C002002",
    title: "1：25万建始县幅（H49C002002）地质图",
    bbox: [[109.482056, 31.018476], [111.009155, 29.996748]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010007006",
    code: "H49C001004",
    title: "1：25万随州市幅（H49C001004）地质图",
    bbox: [[112.482893, 32.023335], [114.017841, 30.998467]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101010006201",
    code: "hubgs_1_50_dzt",
    title: "湖北省1:50万地质图",
    bbox: [[108.151924, 33.628596], [116.521936, 29.041019]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101030006203",
    code: "hubgs_1_50_fjskct",
    title: "湖北省1:50万非金属矿产图",
    bbox: [[108.151924, 33.628596], [116.521936, 29.041019]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
  {
    id: "WMTS020101030006202",
    code: "hubgs_1_50_jskct",
    title: "湖北省1:50万金属矿产图",
    bbox: [[108.151924, 33.628596], [116.521936, 29.041019]] as [
      GeoPoint,
      GeoPoint,
    ],
  },
] as const;

const tileMatrixSet = world_crs84_quad.clone().setZoom(3, 16);

const urlTemplate = `${BASE}?layer=${
  encodeURIComponent("{layer}")
}&style=default&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}`;

const layers = tilesets.map(({ id, code, title, bbox }) =>
  new MapLayer(
    title,
    title,
    code,
    bbox,
    tileMatrixSet,
    urlTemplate.replace(encodeURIComponent("{layer}"), id),
    "image/png",
  )
);

export const service: Service = {
  title: "湖北省地质局 地质一张图",
  abstract: "湖北省地质局 地质一张图 By liuxspro@gmail.com",
  keywords: ["湖北省地质局"],
};

export const cap = new Capabilities(service, layers).xml;
export default cap;
