import { Hono } from "hono";
import { XYZ } from "@liuxspro/libs/geo";

const app = new Hono();

app.get("/tile/bing/:z/:x/:y", (c) => {
  const { z, x, y } = c.req.param();
  const xyz = new XYZ(parseInt(x), parseInt(y), parseInt(z));
  const quadkey = xyz.to_bing_quadkey();
  const redirect =
    `https://ecn.t3.tiles.virtualearth.net/tiles/a${quadkey}.jpeg?g=0&dir=dir_n`;

  // 重定向至 redict_url
  return c.redirect(redirect);
});

export default app;
