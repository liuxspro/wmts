import { Router } from "jsr:@oak/oak/router";
import { tianditu_cap } from "../maps/tianditu.ts";
import { gen_sd_cap } from "../maps/tianditu_sd.ts";

export const router = new Router();

router.get("/tianditu", (ctx) => {
  const headers = ctx.request.headers;
  const tk_name = "tdt"; // 如果用tk, arcgis 设置的自定义参数会导致瓦片URL tk 重复
  const tdt_tk = headers.get(tk_name) ||
    ctx.request.url.searchParams.get(tk_name);
  if (tdt_tk) {
    // 创建图层副本并设置token
    let token = tdt_tk;
    // 处理请求参数后携带 `/1.0.0/WMTSCapabilities.xml`的情况（arcgis 10.2）
    if (tdt_tk.includes("/")) {
      token = tdt_tk.split("/")[0];
    }
    // 处理请求参数后携带 `?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities`的情况（arcgis 10.2）
    if (tdt_tk.includes("?")) {
      token = tdt_tk.split("?")[0];
    }
    ctx.response.type = "text/xml;charset=UTF-8";
    ctx.response.body = tianditu_cap(token);
  } else {
    ctx.response.status = 404;
    ctx.response.body = "tianditu token not set";
  }
});

router.get("/tianditu/sdhis/:id/:el", (ctx) => {
  const { id, el } = ctx.params;
  const z = parseInt(el);
  const tk = ctx.request.url.searchParams.get("tk") || "";
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body = gen_sd_cap(id, 3, z, tk);
});
