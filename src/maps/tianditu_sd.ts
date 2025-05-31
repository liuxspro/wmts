/**
 * 山东天地图历史影像
 * 根据 影像元数据 接口查询历史影像列表
 * https://www.sdmap.gov.cn/resourceCenter.html#/funInfo?sign=info&type=imagemetaData
 * 瓦片模板 https://service.sdmap.gov.cn/hisimage/weipianjn202503?tk=<tk>&layer=c&style=c&tilematrixset=c&Service=WMTS&Request=GetTile&TileMatrix=18&TileCol=216343&TileRow=38819
 */

import {
  Capabilities,
  cgcs2000_quad,
  GeoPoint,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const host = "https://service.sdmap.gov.cn/hisimage";
const sd_bbox: [GeoPoint, GeoPoint] = [
  { lon: 114.2298, lat: 33.9389 }, // 西南角 (LowerCorner)
  { lon: 123.4005, lat: 38.9048 }, // 东北角 (UpperCorner)
];
const service: Service = {
  title: "山东天地图历史影像",
  abstract: "山东天地图历史影像",
  keywords: ["山东天地图"],
};

/**
 * 根据id和层级信息生成能力文档
 * 供 QGIS 插件调用
 * @param id 地图 id
 * @param sl 起始层级
 * @param el 终止层级
 * @param tk token
 * @returns 能力文档
 */
export function gen_sd_cap(
  id: string,
  sl: number,
  el: number,
  tk: string,
): string {
  const tile_url =
    `${host}/${id}?tk=${tk}&layer=c&style=c&tilematrixset=c&Service=WMTS&Request=GetTile&TileMatrix={z}&TileCol={x}&TileRow={y}`;
  const layer = new MapLayer(
    id,
    id,
    id,
    sd_bbox,
    cgcs2000_quad.clone().setZoom(sl, el),
    tile_url,
    "image/jpeg",
  );

  return new Capabilities(service, [layer]).xml;
}
