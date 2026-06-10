/**
 * 影像上海：https://shanghai.tianditu.gov.cn/theme-image/
 * 瓦片URL：https://map4.shanghai-map.net/arcgis/rest/services/shyx2023/MapServer/tile/11/335/1711
 * 瓦片坐标系 EPSG:4490
 */

import {
  BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const host = "https://map4.shanghai-map.net/";
const sh_bbox: BBox = [
  [120.8524133429014000, 30.6803683617105207],
  [122.1167143514860811, 31.8750219724860386],
];

const sh_maps = [
  { name: "2025年", id: "shyx2025" },
  { name: "2024年", id: "shyx2024" },
  { name: "2023年", id: "shyx2023" },
  { name: "2022年", id: "shyx2022" },
  { name: "2021年", id: "shyx2021" },
  { name: "2020年", id: "shyx2020" },
  { name: "2019年", id: "shyx2019" },
  { name: "2018年", id: "shyx2018" },
  { name: "2017年", id: "shyx2017" },
  { name: "2015年", id: "shyx2015" },
  { name: "1999年", id: "shyx1999" },
  { name: "1979年", id: "shyx1979" },
  { name: "1948年", id: "shyx1948" },
];

export const sh_layers = sh_maps.map((map) => {
  return new MapLayer(
    `上海 ${map.name}影像`,
    `${map.name}`,
    map.id,
    sh_bbox,
    cgcs2000_quad,
    `${host}arcgis/rest/services/${map.id}/MapServer/tile/{z}/{y}/{x}`,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 上海",
  abstract: "天地图 上海 历史影像",
  keywords: ["天地图", "上海", "历史影像"],
};

const cap = new Capabilities(service, sh_layers).xml;
export default cap;
