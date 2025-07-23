import { Hono } from "@hono/hono";
import { tianditu_cap } from "../maps/tianditu.ts";
import { gen_sd_cap } from "../maps/tianditu_sd.ts";

export const router = new Hono();

router.get("/", (c) => {
  const tk_name = "tdt"; // 如果用tk, arcgis 设置的自定义参数会导致瓦片URL tk 重复
  const tdt_tk = c.req.header(tk_name) || c.req.query(tk_name);
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
    c.header("Content-Type", "text/xml;charset=UTF-8");
    return c.body(tianditu_cap(token));
  } else {
    return c.text("Tianditu token is required", 400);
  }
});

router.get("/sdhis/:id/:el", (c) => {
  const { id, el } = c.req.param();
  const z = parseInt(el);
  const tk = c.req.query("tk") || "";
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(gen_sd_cap(id, 3, z, tk));
});
