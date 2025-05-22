/**
 * 天地图 北京
 * 多时相影像 https://beijing.tianditu.gov.cn/bjtdt-main/compare.html
 * 瓦片 URL https://beijing.tianditu.gov.cn/iserver/services/map-2022_img/rest/maps/tdt_img_202401/zxyTileImage/{z}/{x}/{y}.png?width=256&height=256&transparent=true
 * See: https://iportal.supermap.io/iportal/help/html/zh/mergedProjects/SuperMapiServerRESTAPI/root/maps/map/zxyTileImage/zxyTileImage.htm
 */

import {
  default_matrix,
  generate_capabilities,
  GeoPoint,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const beijing_maps = {
  tdt_img_202203: "北京 - 2022年03月影像",
  tdt_img_202206: "北京 - 2022年06月影像",
  tdt_img_202209: "北京 - 2022年09月影像",
  tdt_img_202212: "北京 - 2022年12月影像",
  tdt_img_202301: "北京 - 2023年01月影像",
  tdt_img_202302: "北京 - 2023年02月影像",
  tdt_img_202303: "北京 - 2023年03月影像",
  tdt_img_202304: "北京 - 2023年04月影像",
  tdt_img_202305: "北京 - 2023年05月影像",
  tdt_img_202306: "北京 - 2023年06月影像",
  tdt_img_202401: "北京 - 2024年01月影像",
  tdt_img_202403: "北京 - 2024年03月影像",
  tdt_img_202404: "北京 - 2024年04月影像",
};

const beijing_old_maps = {
  tdt_img_1951: "北京 - 1951年影像",
  tdt_img_1966: "北京 - 1966年影像",
  tdt_img_1996: "北京 - 1996年影像",
};

const beijing_bbox: [GeoPoint, GeoPoint] = [
  { lon: 115.413811, lat: 39.443493 }, // 西南角 (LowerCorner)
  { lon: 117.506111, lat: 41.058609 }, // 东北角 (UpperCorner)
];

// 1951、1966、1996年影像范围
const beijing_old_bbox: [GeoPoint, GeoPoint] = [
  { lon: 116.28899792, lat: 39.82830693 },
  { lon: 116.47452581, lat: 39.98153392 },
];

const beijing_layers: MapLayer[] = [];
const beijing_old_layers: MapLayer[] = [];

Object.entries(beijing_maps).forEach(([key, name]) => {
  beijing_layers.push(
    new MapLayer(
      name,
      name,
      key,
      beijing_bbox,
      "WebMercatorQuad",
      `https://beijing.tianditu.gov.cn/iserver/services/map-2022_img/rest/maps/${key}/zxyTileImage/{z}/{x}/{y}.png?width=256&height=256&transparent=true`,
      "image/png",
    ),
  );
});

Object.entries(beijing_old_maps).forEach(([key, name]) => {
  beijing_old_layers.push(
    new MapLayer(
      name,
      name,
      key,
      beijing_old_bbox,
      "WebMercatorQuad",
      `https://beijing.tianditu.gov.cn/iserver/services/map-2022_img/rest/maps/${key}/zxyTileImage/{z}/{x}/{y}.png?width=256&height=256&transparent=true`,
      "image/png",
    ),
  );
});

export const service: Service = {
  title: "天地图 北京",
  abstract: "天地图 北京 多时相影像",
  keywords: ["天地图", "北京", "多时相影像"],
};
export const cap = generate_capabilities(service, [
  ...beijing_old_layers,
  ...beijing_layers,
], [
  default_matrix.WebMercatorQuad,
]);
