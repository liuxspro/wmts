/**
 * 能力文档地址
 * https://igss.cgs.gov.cn:6160/igs/rest/ogc/qg50w_20210416_F7qGy9A7/WMTSServer/1.0.0/WMTSCapabilities.xml?tk=您的token
 * 瓦片URL
 * KVP 方式
 * https://igss.cgs.gov.cn:6160/igs/rest/ogc/{LayerId}/WMTSServer?
 * tk={tk}&Width=256&Height=256&layer={LayerId}&style=default&tilematrixset=EPSG%3A4326_{LayerId}_028mm_GB
 * &Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}
 * REST 方式
 * https://igss.cgs.gov.cn:6160/igs/rest/ogc/{LayerId}/WMTSServer/1.0.0/{LayerId}/default/EPSG%3A4326_{LayerId}_028mm_GB/{z}/{y}/{x}.png?tk={tk}
 *
 * 注意申请 tk 的类型要为“客户端”
 * QGIS 默认的 User-Agent 为`Mozilla/5.0 QGIS/34200/Windows 11 Version 2009`
 * 既不是浏览器端（还需要包含Chrome），也不是服务端（不能包含Mozilla）
 *
 * 注意地质云的瓦片矩阵集的z比正常少1 {z-1}
 */

import {
  generate_capabilities,
  generate_crs84_tile_matrixs,
  MapLayer,
  Service,
  TileMatrixSet,
  GeoPoint,
} from "@liuxspro/capgen";

const china_bbox: [GeoPoint, GeoPoint] = [
  { lon: 73.49895477, lat: 3.83254099 }, // 西南角 (LowerCorner)
  { lon: 135.08738708, lat: 53.55849838 }, // 东北角 (UpperCorner)
];
const matrix = generate_crs84_tile_matrixs(2, 15);

const matrix_less = matrix.map((t) => {
  const n = t.identifier;
  const less = parseInt(n) - 1;
  t.identifier = String(less);
  return t;
});

export const geocloud_quad: TileMatrixSet = {
  title: "CRS84 for the World",
  id: "WorldCRS84Quad",
  supported_crs: "EPSG:4326",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  tile_matrixs: matrix_less,
};

export const service: Service = {
  title: "地质云 GeoCloud",
  abstract: "地质云 GeoCloud 服务 By liuxspro@gmail.com",
  keywords: ["地质云", "GeoCloud"],
};

const layers = {
  qg250w_20210416_ZAZSeOGX: "全国 1:250 万地质图", // 最大 16 级（17）
  qg150w_20210416_BIwqE0wU: "全国 1:150 万地质图", // 最大 14 级（15）
  全国100万地质图_20210330_rpam5kdJ: "全国 1:100 万地质图", // 最大 11 级（12）
  qg50w_20210416_F7qGy9A7: "全国 1:50 万地质图", // 最大 13 级（14）
  qg20_20210401_FCnDDRJd: "全国 1:20 万地质图", // 最大 14 级（15）
};

export const geocloud_layers: MapLayer[] = [];

Object.entries(layers).forEach(([key, value]) => {
  const HOST = "https://igss.cgs.gov.cn:6160";
  const url = `${HOST}/igs/rest/ogc/${key}/WMTSServer/1.0.0/${key}/default/EPSG%3A4326_${key}_028mm_GB/{z}/{y}/{x}.png?`;
  geocloud_layers.push(
    new MapLayer(
      value,
      value,
      key,
      china_bbox,
      "WorldCRS84Quad",
      url,
      "image/png"
    )
  );
});

export const cap = generate_capabilities(service, geocloud_layers, [
  geocloud_quad,
]);
