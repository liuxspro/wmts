/**
 * 天地图徐州 影像对比系统
 * http://www.xzmap.gov.cn/xuzhou/compereXZ/map/comp.jsp
 * 测试接口
 * http://221.229.211.117/DOM/service-tile.jsp
 *
 * 瓦片模板
 * http://221.229.211.117/DOM/wmts/BZ_DOM_24_QS/BZ_DOM_24_QS/BZ_DOM_24_QS_Matrix_0/18/40587/216393.png
 * http://221.229.211.117/DOM/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=BZ_DOM_24_QS&STYLE=BZ_DOM_24_QS&TILEMATRIXSET=BZ_DOM_24_QS_Matrix_0&TILEMATRIX=18&TILEROW=40587&TILECOL=216393
 *
 */

import {
  GeoPoint,
  default_service,
  generate_capabilities,
  generate_crs84_tile_matrixs,
  MapLayer,
  TileMatrixSet,
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

const xz_matrix: TileMatrixSet = {
  title: "CRS84 for Xu Zhou",
  id: "CGCS2000Quad",
  supported_crs: "EPSG:4490",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  tile_matrixs: generate_crs84_tile_matrixs(11, 18),
};

const xz_layers: MapLayer[] = [];

Object.entries(xz_maps).forEach(([key, name]) => {
  xz_layers.push(
    new MapLayer(
      name,
      name,
      key,
      xz_bbox,
      "CGCS2000Quad",
      `http://221.229.211.117/DOM/wmts/${key}/${key}/${key}_Matrix_0/{z}/{y}/{x}.png`
    )
  );
});

export const cap = generate_capabilities(default_service, xz_layers, [
  xz_matrix,
]);
