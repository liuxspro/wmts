/**
 * 天地图浙江 多时相历史影像
 * 数据来源: https://ditu.zjzwfw.gov.cn/resources-server/rescenter/index.html
 *
 * 坐标系: EPSG:4490
 * 瓦片模板
 * https://ditu.zjzwfw.gov.cn:443/services/wmts/imgmap/{name}/oss/getTile/{z}/{y}/{x}
 * 需要添加Referer: https://ditu.zjzwfw.gov.cn/resources-server/rescenter/index.html
 */
import zhejiang_maps from "./zhejiang.json" with { type: "json" };

import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const zj_bbox: BBox = [
  [117.5, 26.8],
  [123.7, 31.6],
];

const zj_layer = zhejiang_maps.map((map) => {
  return new MapLayer(
    `浙江 ${map.name}`,
    `${map.name}`,
    map.id,
    zj_bbox,
    cgcs2000_quad,
    `${map.access.url}/getTile/{z}/{y}/{x}`,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 浙江",
  abstract: "天地图 浙江 历史影像",
  keywords: ["天地图", "浙江", "历史影像"],
};

const cap = new Capabilities(service, zj_layer).xml;
export default cap;
