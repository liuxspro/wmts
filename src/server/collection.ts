import { Router } from "jsr:@oak/oak/router";

import { Capabilities, Service } from "@liuxspro/capgen";

import { layers as osm } from "../maps/osm.ts";
import { layers as google } from "../maps/google_map.ts";
import { layers as amap } from "../maps/amap.ts";
import { layers as haitu } from "../maps/shipxy.ts";
import { layers as bing } from "../maps/bing.ts";

export const router = new Router();

export const service: Service = {
  title: "Collection of XYZ Maps",
  abstract: "常用XYZ瓦片合集",
  keywords: ["XYZ"],
};

router.get("/collection", (ctx) => {
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body =
    new Capabilities(service, [...osm, ...google, ...amap, ...haitu, ...bing])
      .xml;
});
