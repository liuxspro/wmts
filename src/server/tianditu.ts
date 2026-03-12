import { Hono } from "hono";
import { tianditu_cap } from "../maps/tianditu/main.ts";
import { gen_sd_cap } from "../maps/tianditu/shandong.ts";
import { cap as 福建 } from "../maps/tianditu/fujian.ts";
import { cap as 江苏 } from "../maps/tianditu/jiangsu.ts";

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

app.get("/fujian", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(福建);
});

app.get("/jiangsu", (c) => {
  c.header("Content-Type", "text/xml;charset=UTF-8");
  return c.body(江苏);
});

export default app;
