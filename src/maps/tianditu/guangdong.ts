/**
 * 广东省天地图 资源中心
 * https://guangdong.tianditu.gov.cn/GeoResourceCenter/index.html
 */

import {
  Capabilities,
  cgcs2000_quad,
  GeoPoint,
  MapLayer,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const service: Service = {
  title: "天地图 广东",
  abstract: "天地图 广东 历史影像",
  keywords: ["天地图", "广东", "历史影像"],
};

const gd_bbox: [GeoPoint, GeoPoint] = [
  { lon: 106.875, lat: 19.3111 }, // 西南角 (LowerCorner)
  { lon: 118.125, lat: 27.0591 }, // 东北角 (UpperCorner)
];

const host = "https://guangdong.tianditu.gov.cn/geostar";

const gd_maps = [
  {
    key: "gdsyjjbntbhtb_mercator",
    name: "广东省永久基本农田保护图斑（墨卡托）",
    minZoom: 7,
    maxZoom: 15,
    crs: "web_mercator",
  },
  {
    key: "GDJBNTBHTB",
    name: "广东省永久基本农田保护图斑",
    minZoom: 7,
    maxZoom: 15,
    crs: "cgcs2000",
  },
  {
    key: "SQSXWPSJ",
    name: "广东省三区三线专题图",
    minZoom: 7,
    maxZoom: 15,
    crs: "cgcs2000",
  },
  {
    key: "JCDTZ_50W",
    name: "广东省50万基础地质图",
    minZoom: 7,
    maxZoom: 17,
    crs: "cgcs2000",
  },
  {
    key: "SWDTZ_50W",
    name: "广东省50万水文地质图",
    minZoom: 7,
    maxZoom: 17,
    crs: "cgcs2000",
  },
  {
    key: "DOM_GZ_90ND_GK",
    name: "广州市90年代影像电子地图",
    minZoom: 7,
    maxZoom: 17,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2000_2015_GK",
    name: "广东省2015年影像图",
    minZoom: 7,
    maxZoom: 17,
    crs: "cgcs2000",
  },
  {
    key: "dom_2016",
    name: "广东省2016年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2017",
    name: "广东省2017年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2018",
    name: "广东省2018年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2019",
    name: "广东省2019年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2020",
    name: "广东省2020年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2021",
    name: "广东省2021年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
  {
    key: "DOM_2022",
    name: "广东省2022年影像图",
    minZoom: 7,
    maxZoom: 18,
    crs: "cgcs2000",
  },
];

export const gd_layers = gd_maps.map((map) => {
  return new MapLayer(
    map.name,
    map.name,
    map.key,
    gd_bbox,
    map.crs === "web_mercator"
      ? web_mercator_quad.clone().setZoom(map.minZoom, map.maxZoom)
      : cgcs2000_quad.clone().setZoom(map.minZoom, map.maxZoom),
    `${host}/${map.key}/DataServer?l={z}&x={x}&y={y}`,
    "image/png",
  );
});

const cap = new Capabilities(service, gd_layers).xml;
export default cap;
