/**
 * 天地图江苏 多时相
 * https://jiangsu.tianditu.gov.cn/mulitdate/index.html
 * 获取多时相配置
 * https://jiangsu.tianditu.gov.cn/server/mulitdate/getConfig?type=%E5%A4%9A%E6%97%B6%E7%9B%B8%E9%85%8D%E7%BD%AE
 *
 * 坐标系: EPSG:4490
 * 瓦片模板
 * https://jiangsu.tianditu.gov.cn/historyraster/rest/services/History/yxdt_js_1966_2k/MapServer/tile/{z}/{y}/{x}
 * https://jiangsu.tianditu.gov.cn/tdtsite05/rest/services/tdtjs/js_img2024_r05/MapServer/tile/12/658/3397
 */
import jiangsu_maps from "./jiangsu.json" with { type: "json" };

import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const js_bbox: BBox = [
  [116.10358, 30.710719],
  [122.090304, 35.212659],
];

const js_layer = jiangsu_maps.map((map) => {
  return new MapLayer(
    `江苏 ${map.name} 影像地图`,
    `${map.name}`,
    map.id,
    js_bbox,
    cgcs2000_quad,
    `https:${map.url}/tile/{z}/{y}/{x}`,
    "image/jpeg",
  );
});
export const service: Service = {
  title: "天地图 江苏",
  abstract: "天地图 江苏 历史影像",
  keywords: ["天地图", "江苏", "历史影像"],
};

const cap = new Capabilities(service, js_layer).xml;
export default cap;
