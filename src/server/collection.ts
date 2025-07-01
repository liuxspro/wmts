import { Router } from "jsr:@oak/oak/router";

import { Capabilities, Service } from "@liuxspro/capgen";

import { layers as osm } from "../maps/osm.ts";
import { layers as google } from "../maps/google_map.ts";
import { layers as amap } from "../maps/amap.ts";
import { layers as haitu } from "../maps/shipxy.ts";
import { layers as bing } from "../maps/bing.ts";
import { tianditu_layers } from "../maps/tianditu.ts";
import { esri_layers } from "../maps/esri.ts";
import { gggis } from "../maps/gggis.ts";
import { layers as yandex } from "../maps/yandex.ts";

export const router = new Router();

const tianditu = tianditu_layers.filter((layer) => layer.id.includes("_w")).map(
  (layer) => {
    layer.set_token("tk", "4267820f43926eaf808d61dc07269beb"); // Key from Geoscene
    return layer;
  },
);

export const service: Service = {
  title: "Collection of Basemaps",
  abstract:
    "本服务提供常用 XYZ 格式地图瓦片合集，通过标准 WMTS 接口发布，支持各类 GIS 平台调用。by liuxspro@gmail.com",
  keywords: ["XYZ", "basemaps"],
};

export const collection = new Capabilities(service, [
  ...osm,
  ...google,
  ...amap,
  ...haitu,
  ...bing,
  ...tianditu,
  ...esri_layers,
  ...gggis,
  ...yandex,
]).xml;

router.get("/collection", (ctx) => {
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body = collection;
});
