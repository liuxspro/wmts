/**
 * 天地图徐州 影像对比系统
 * http://www.xzmap.gov.cn/xuzhou/compereXZ/map/comp.jsp
 * 测试接口
 * http://221.229.211.117/DOM/service-tile.jsp
 *
 * 瓦片模板
 * http://221.229.211.117/DOM/wmts/BZ_DOM_24_QS/BZ_DOM_24_QS/BZ_DOM_24_QS_Matrix_0/18/40587/216393.png
 * http://221.229.211.117/DOM/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=BZ_DOM_24_QS&STYLE=BZ_DOM_24_QS&TILEMATRIXSET=BZ_DOM_24_QS_Matrix_0&TILEMATRIX=18&TILEROW=40587&TILECOL=216393
 */

import {
  Capabilities,
  GeoPoint,
  MapLayer,
  Service,
  world_crs84_quad,
} from "@liuxspro/capgen";

const xz_maps = {
  BZ_DOM_24_QS: "徐州 2024 年影像",
  BZ_DOM_23_QS: "徐州 2023 年影像",
  BZ_DOM_22_QS: "徐州 2022 年影像",
  BZ_DOM_21_QS: "徐州 2021 年影像",
  BZ_DOM_20_QS: "徐州 2020 年影像",
  BZ_DOM_19_QS: "徐州 2019 年影像",
  BZ_DOM_18_QS: "徐州 2018 年影像",
};

const xz_bbox: [GeoPoint, GeoPoint] = [
  { lon: 116.015625, lat: 33.398438 }, // 西南角 (LowerCorner)
  { lon: 118.828125, lat: 35.15625 }, // 东北角 (UpperCorner)
];

const xz_layers: MapLayer[] = [];

Object.entries(xz_maps).forEach(([key, name]) => {
  xz_layers.push(
    new MapLayer(
      name,
      name,
      key,
      xz_bbox,
      world_crs84_quad.clone().setZoom(11, 18),
      `http://221.229.211.117/DOM/wmts/${key}/${key}/${key}_Matrix_0/{z}/{y}/{x}.png`,
      "image/jpeg",
    ),
  );
});
const service: Service = {
  title: "天地图 徐州",
  abstract: "天地图 徐州 历史影像",
  keywords: ["天地图", "徐州", "历史影像"],
};
export const cap = new Capabilities(service, xz_layers).xml;
