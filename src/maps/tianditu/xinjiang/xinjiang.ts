/**
 * 天地图 新疆 多时相历史影像
 * https://xinjiang.tianditu.gov.cn/map/
 *
 * 源服务为 EPSG:4326（default028mm，平方公里网格，28mm 基准），
 * 与 EPSG:4490 的 cgcs2000_quad 数值完全一致，实测 4490 正常出图。
 */

import xinjiang_maps from "./xinjiang.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

// 新疆维吾尔自治区范围，用于约束各图层边界
const xinjiang_bbox: BBox = [
  [73.4, 34.3],
  [96.4, 49.2],
];

// 服务声明 0~16/18/22 级，实测 16 级以上为空瓦片
const MAX_ZOOM = 16;

const xinjiang_layers = xinjiang_maps.map((map) => {
  const bbox: BBox = [
    [
      Math.max(map.bbox[0], xinjiang_bbox[0][0]),
      Math.max(map.bbox[1], xinjiang_bbox[0][1]),
    ],
    [
      Math.min(map.bbox[2], xinjiang_bbox[1][0]),
      Math.min(map.bbox[3], xinjiang_bbox[1][1]),
    ],
  ];
  const url =
    `${map.url}?layer=${map.layer}&style=default&tilematrixset=${map.matrixSet}` +
    `&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg` +
    `&TileMatrix={z}&TileCol={x}&TileRow={y}`;

  return new MapLayer(
    `新疆 ${map.name} 影像`,
    `新疆 ${map.name} 影像`,
    `xinjiang_${map.layer}`,
    bbox,
    cgcs2000_quad.clone().setZoom(1, MAX_ZOOM),
    url,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 新疆",
  abstract: "天地图 新疆 历史影像",
  keywords: ["天地图", "新疆", "历史影像"],
};

const cap = new Capabilities(service, xinjiang_layers).xml;
export default cap;
