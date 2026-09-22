import { Hono } from "hono";
import { tianditu_cap } from "../maps/tianditu/main.ts";
import { gen_sd_cap } from "../maps/tianditu/shandong.ts";
import { cap as 福建 } from "../maps/tianditu/fujian.ts";
import { create_router } from "../utils.ts";
import 江苏 from "../maps/tianditu/jiangsu/router.ts";
import 浙江 from "../maps/tianditu/zhejiang/zhejiang.ts";
import 广东 from "../maps/tianditu/guangdong/router.ts";
import 温州 from "../maps/tianditu/wenzhou.ts";
import 北京 from "../maps/tianditu/beijing/router.ts";
import 上海 from "../maps/tianditu/shanghai.ts";
import 湖南 from "../maps/tianditu/hunan/hunan.ts";
import 河南 from "../maps/tianditu/henan/henan.ts";
import 河北 from "../maps/tianditu/hebei/hebei.ts";
import 山西 from "../maps/tianditu/shanxi/shanxi.ts";
import 江西 from "../maps/tianditu/jiangxi/jiangxi.ts";

const app = new Hono();

/**
 * Tianditu WMTS Capabilities endpoint
 * Accepts a token via header or query parameter "tk" or "tdt"
 * Example: /tianditu?tdt=123&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities
 * Example: /tianditu/1.0.0/WMTSCapabilities.xml?tk=123&
 */
app.on("GET", ["/", "/1.0.0/WMTSCapabilities.xml"], (c) => {
  const tdt = c.req.header("tdt") || c.req.query("tdt");
  const tk = c.req.header("tk") || c.req.query("tk");
  const tdt_tk_final = tdt || tk;
  if (!tdt_tk_final) {
    return c.text(
      "Tianditu token is required, Accepts token via header or query parameter 'tk' or 'tdt'",
      400,
    );
  }
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(tianditu_cap(tdt_tk_final));
});

app.get("/sdhis/:id/:el", (c) => {
  const { id, el } = c.req.param();
  const z = parseInt(el);
  const tk = c.req.query("tk") || "";
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(gen_sd_cap(id, 3, z, tk));
});

app.route("/fujian", create_router(福建));
app.route("/jiangsu", 江苏);
app.route("/guangdong", 广东);
app.route("/beijing", 北京);
app.route("/shanghai", create_router(上海));
app.route("/hunan", create_router(湖南));
app.route("/zhejiang", create_router(浙江));
app.route("/henan", create_router(河南));
app.route("/hebei", create_router(河北));
app.route("/shanxi", create_router(山西));
app.route("/jiangxi", create_router(江西));

app.get("/wenzhou", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(温州);
});

export default app;
