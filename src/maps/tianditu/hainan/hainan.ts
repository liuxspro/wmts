/**
 * 天地图 海南 多时相历史影像
 * https://img.hniplan.com/imagebrower/menuhide
 *
 * 源服务按景（scene）发布 WMTS，每个景一个图层；矩阵集 w 为标准 EPSG:3857
 * （GoogleMapsCompatible，28mm 基准），与 capgen 的 web_mercator_quad 完全一致。
 * 源服务声明 0~20 级，但低层级大景裁剪计算极慢（8/9 级实测 60s 超时），
 * 因此只从 11 级起声明。
 */

import hainan_maps from "./hainan.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  MapLayer,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

// 海南省范围，用于约束各景边界
const hainan_bbox: BBox = [
  [108.5, 18.1],
  [111.1, 20.2],
];

const quad = web_mercator_quad.clone().setZoom(11, 19);

export const hainan_layers = hainan_maps.map((map) => {
  const bbox: BBox = [
    [
      Math.max(map.bbox[0], hainan_bbox[0][0]),
      Math.max(map.bbox[1], hainan_bbox[0][1]),
    ],
    [
      Math.min(map.bbox[2], hainan_bbox[1][0]),
      Math.min(map.bbox[3], hainan_bbox[1][1]),
    ],
  ];
  const url =
    `${map.url}?layer=${map.layer}&style=default&tilematrixset=${map.matrixSet}` +
    `&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng` +
    `&TileMatrix={z}&TileCol={x}&TileRow={y}`;

  return new MapLayer(
    `海南 ${map.name}`,
    `海南 ${map.name}`,
    `hainan_${map.layer}`,
    bbox,
    quad,
    url,
    "image/png",
  );
});

export const service: Service = {
  title: "天地图 海南",
  abstract: "天地图 海南 历史影像",
  keywords: ["天地图", "海南", "历史影像"],
};

const cap = new Capabilities(service, hainan_layers).xml;
export default cap;
