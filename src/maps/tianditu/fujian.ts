/**
 * 天地图福建 多时相
 * https://fujian.tianditu.gov.cn/map/?multiImage=true
 *
 * 坐标系: EPSG:4490
 * 瓦片模板
 * https://s0.fjmap.net/img_fj_2025_his/wmts?TIME=2025-11-30%200%3A00%3A00&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&layer=img_his&style=img_his&format=image%2Ftile&tilematrixset=Matrix_0
 */

import {
  Capabilities,
  cgcs2000_quad,
  GeoPoint,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const fj_bbox: [GeoPoint, GeoPoint] = [
  { lon: 115.4958786070348, lat: 23.013545965473952 },
  { lon: 121.47440903584844, lat: 29.032646732660623 },
];

const host = "https://s0.fjmap.net";
const zyx =
  "&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&layer=img_his&style=img_his&format=image%2Ftile&tilematrixset=Matrix_0";

const img_fj_2025_his = {
  "2025-11-30%200%3A00%3A00": "福建 多时相影像 2025-11-30",
  "2025-10-31%200%3A00%3A00": "福建 多时相影像 2025-10-31",
  "2025-9-30%200%3A00%3A00": "福建 多时相影像 2025-9-30",
  "2025-8-31%200%3A00%3A00": "福建 多时相影像 2025-8-31",
  "2025-7-31%200%3A00%3A00": "福建 多时相影像 2025-7-31",
  "2025-6-30%200%3A00%3A00": "福建 多时相影像 2025-6-30",
  "2025-5-31%200%3A00%3A00": "福建 多时相影像 2025-5-31",
  "2025-4-30%200%3A00%3A00": "福建 多时相影像 2025-4-30",
  "2025-3-31%200%3A00%3A00": "福建 多时相影像 2025-3-31",
  "2025-2-28%200%3A00%3A00": "福建 多时相影像 2025-2-28",
  "2025-1-31%200%3A00%3A00": "福建 多时相影像 2025-1-31",
};

export const service: Service = {
  title: "天地图 福建",
  abstract: "天地图 福建 多时相影像",
  keywords: ["天地图", "福建", "多时相影像"],
};

const tianditu_fj_layers: MapLayer[] = [];
Object.entries(img_fj_2025_his).forEach(([time, name]) => {
  tianditu_fj_layers.push(
    new MapLayer(
      name,
      name,
      `tianditu_fj_2025_${
        time.slice(0, 10).replaceAll("-", "_").replaceAll("%", "")
      }`,
      fj_bbox,
      cgcs2000_quad.clone().setZoom(7, 18),
      `${host}/img_fj_2025_his/wmts?TIME=${time}${zyx}`,
    ),
  );
});

const ter_layer = new MapLayer(
  "天地图 福建 地形图 2021",
  "天地图 福建 地形图 2021",
  "tianditu_fj_ter",
  fj_bbox,
  cgcs2000_quad.clone().setZoom(7, 18),
  `https://s0.fjmap.net/ter_fj_2021/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=TER_FJ&STYLE=default&FORMAT=tiles&TILEMATRIXSET=default028mm&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,
);

tianditu_fj_layers.push(ter_layer);

export const cap = new Capabilities(service, tianditu_fj_layers).xml;
