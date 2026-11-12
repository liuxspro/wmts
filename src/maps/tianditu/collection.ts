/**
 * 天地图省级历史影像合集
 *
 * 包含：江苏、北京、广东、上海、福建、湖南、河南、河北、山西、江西、新疆。
 * 浙江、山东、温州因瓦片服务较特殊（需要 Referer、token 或自定义坐标系），
 * 不并入本合集，仍通过各自的路由单独提供服务。
 */

import { Capabilities, Service } from "@liuxspro/capgen";

import { js_layers } from "./jiangsu/江苏.ts";
import { bj_layers } from "./beijing/beijing.ts";
import { gd_layers } from "./guangdong/guangdong.ts";
import { sh_layers } from "./shanghai.ts";
import { tianditu_fj_layers } from "./fujian.ts";
import { hn_dizhi, hn_layers } from "./hunan/hunan.ts";
import { henan_layers } from "./henan/henan.ts";
import { hebei_layers } from "./hebei/hebei.ts";
import { shanxi_layers } from "./shanxi/shanxi.ts";
import { jiangxi_layers } from "./jiangxi/jiangxi.ts";
import { xinjiang_layers } from "./xinjiang/xinjiang.ts";

export const service: Service = {
  title: "天地图 省级历史影像",
  abstract: "天地图省级节点历史影像合集，不含浙江、山东、温州",
  keywords: ["天地图", "省级", "历史影像"],
};

export const layers = [
  ...js_layers,
  ...bj_layers,
  ...gd_layers,
  ...sh_layers,
  ...tianditu_fj_layers,
  ...hn_layers,
  hn_dizhi,
  ...henan_layers,
  ...hebei_layers,
  ...shanxi_layers,
  ...jiangxi_layers,
  ...xinjiang_layers,
];

export const collection = new Capabilities(service, layers).xml;
export default collection;
