/**
 * 天地图 江西 多时相历史影像
 * https://jiangxi.tianditu.gov.cn/workorder/restHistoryImage/getNormalHistoryImageList.json
 *
 * 瓦片为标准 WMTS（EPSG:4490），矩阵集 guobiao 使用平方公里网格，
 * 对应 capgen 的 cgcs2000_quad（28mm 基准，1~18 级）。
 */

import jiangxi_maps from "./jiangxi.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

// 江西省范围，用于约束各图层边界
const jiangxi_bbox: BBox = [
  [113.3197, 24.2062],
  [118.7336, 30.3602],
];

const jiangxi_layers = jiangxi_maps.map((map) => {
  const url =
    `${map.url}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${map.layer}&STYLE=default&TILEMATRIXSET=${map.matrixSet}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg`;
  // 部分图层（如 1996 年南昌影像）的范围是全球，此处裁剪到江西省
  const bbox: BBox = [
    [
      Math.max(map.bbox[0], jiangxi_bbox[0][0]),
      Math.max(map.bbox[1], jiangxi_bbox[0][1]),
    ],
    [
      Math.min(map.bbox[2], jiangxi_bbox[1][0]),
      Math.min(map.bbox[3], jiangxi_bbox[1][1]),
    ],
  ];

  return new MapLayer(
    map.name,
    map.name,
    `jiangxi_${map.layer}`,
    bbox,
    // 服务端 capabilities 自报的基准比例尺是 96 DPI（591658721.9），但标准客户端
    // 按 ScaleDenominator * 0.00028 反算分辨率，只有 28mm 基准的 cgcs2000_quad
    // 才能满足 scale * 0.00028 * 256 = 360 / 2^z，瓦片行列才不会整体错位
    cgcs2000_quad,
    url,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 江西",
  abstract: "天地图 江西 历史影像",
  keywords: ["天地图", "江西", "历史影像"],
};

const cap = new Capabilities(service, jiangxi_layers).xml;
export default cap;
