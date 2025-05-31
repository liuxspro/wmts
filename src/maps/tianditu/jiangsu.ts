/**
 * 天地图江苏 多时相
 * https://jiangsu.tianditu.gov.cn/mulitdate/index.html
 * https://jiangsu.tianditu.gov.cn/server/mulitdate/getConfig?type=%E5%A4%9A%E6%97%B6%E7%9B%B8%E9%85%8D%E7%BD%AE
 *
 * 坐标系: EPSG:4490
 * 瓦片模板
 * https://jiangsu.tianditu.gov.cn/historyraster/rest/services/History/yxdt_js_1966_2k/MapServer/tile/{z}/{y}/{x}
 * https://jiangsu.tianditu.gov.cn/tdtsite05/rest/services/tdtjs/js_img2024_r05/MapServer/tile/12/658/3397
 */

import {
  Capabilities,
  cgcs2000_quad,
  GeoPoint,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const host = "https://jiangsu.tianditu.gov.cn";
const zyx = "MapServer/tile/{z}/{y}/{x}";

const js_bbox: [GeoPoint, GeoPoint] = [
  { lon: 116.10358, lat: 30.710719 }, // 西南角 (LowerCorner)
  { lon: 122.090304, lat: 35.212659 }, // 东北角 (UpperCorner)
];

const map_name = {
  js_yxdt_1966: "江苏 1966年影像地图",
  js_yxdt_1976: "江苏 1976年影像地图",
  js_yxdt_2005: "江苏 2005年影像地图",
  js_yxdt_2010: "江苏 2010年影像地图",
  js_yxdt_2012: "江苏 2012年影像地图",
  js_yxdt_2014: "江苏 2014年影像地图",
  js_yxdt_2016: "江苏 2016年影像地图",
  js_yxdt_2017: "江苏 2017年影像地图",
  js_yxdt_2018: "江苏 2018年影像地图",
  js_yxdt_2019: "江苏 2019年影像地图",
  js_yxdt_2020: "江苏 2020年影像地图",
  js_yxdt_2021: "江苏 2021年影像地图",
  js_yxdt_2022: "江苏 2022年影像地图",
  js_yxdt_2023: "江苏 2023年影像地图",
  js_yxdt_2024: "江苏 2024年影像地图",
};

const map_url = {
  js_yxdt_1966:
    `${host}/historyraster/rest/services/History/yxdt_js_1966_2k/${zyx}`,
  js_yxdt_1976:
    `${host}/historyraster/rest/services/History/yxdt_js_1976_2k/${zyx}`,
  js_yxdt_2005:
    `${host}/historyraster/rest/services/History/js_yxdt_2005/${zyx}`,
  js_yxdt_2010:
    `${host}/historyraster/rest/services/History/js_yxdt_2010/${zyx}`,
  js_yxdt_2012:
    `${host}/historyraster/rest/services/History/js_yxdt_2012/${zyx}`,
  js_yxdt_2014:
    `${host}/historyraster/rest/services/History/js_yxdt_2014/${zyx}`,
  js_yxdt_2016: `${host}/mapjs2/rest/services/MapJS/js_yxdt_2016/${zyx}`,
  js_yxdt_2017:
    `${host}/historyraster/rest/services/History/js_yxdt_2017/${zyx}`,
  js_yxdt_2018: `${host}/mapjs2/rest/services/MapJS/js_yxdt_2018/${zyx}`,
  js_yxdt_2019:
    `${host}/historyraster/rest/services/History/js_yxdt_2019/${zyx}`,
  js_yxdt_2020:
    `${host}/historyraster/rest/services/History/js_yxdt_2020/${zyx}`,
  js_yxdt_2021:
    `${host}/historyraster/rest/services/History/js_yxdt_2021/${zyx}`,
  js_yxdt_2022: `${host}/tdtsite05/rest/services/tdtjs/js_img2022_r05/${zyx}`,
  js_yxdt_2023: `${host}/tdtsite05/rest/services/tdtjs/js_img2023_r05/${zyx}`,
  js_yxdt_2024: `${host}/tdtsite05/rest/services/tdtjs/js_img2024_r05/${zyx}`,
};

const tianditu_js_layers: MapLayer[] = [];

Object.entries(map_url).forEach(([key, url]) => {
  tianditu_js_layers.push(
    new MapLayer(
      map_name[key as keyof typeof map_name],
      map_name[key as keyof typeof map_name],
      key,
      js_bbox,
      cgcs2000_quad,
      url,
      "image/jpeg",
    ),
  );
});
export const service: Service = {
  title: "天地图 江苏",
  abstract: "天地图 江苏 历史影像",
  keywords: ["天地图", "江苏", "历史影像"],
};

export const cap = new Capabilities(service, tianditu_js_layers).xml;
