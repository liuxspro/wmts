import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { send } from "jsr:@oak/oak/send";
import { service as tdt_service, tianditu_layers } from "./maps/tianditu.ts";
import {
  geocloud_layers,
  geocloud_quad,
  service as geocloud_service,
} from "./maps/geocloud.ts";
import { gen_sd_cap } from "./maps/tianditu_sd.ts";
import {
  default_matrix,
  generate_capabilities,
  MapLayer,
} from "@liuxspro/capgen";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "On Deno Deploy 💖";
});

// 天地图
router.get("/tianditu", (ctx) => {
  const headers = ctx.request.headers;
  const tk_name = "tdt"; // 如果用tk, arcgis 设置的自定义参数会导致瓦片URL tk 重复
  const tdt_tk =
    headers.get(tk_name) || ctx.request.url.searchParams.get(tk_name);
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
    const layersWithToken = tianditu_layers.map((layer) => {
      const newLayer = new MapLayer(
        layer.title,
        layer.abstract,
        layer.id,
        layer.bbox,
        layer.tile_matrix_set,
        layer.url,
        layer.format
      );
      newLayer.set_token("tk", token);
      return newLayer;
    });

    ctx.response.type = "text/xml;charset=UTF-8";
    ctx.response.body = generate_capabilities(tdt_service, layersWithToken, [
      default_matrix.WebMercatorQuad,
      default_matrix.CGCS2000,
    ]);
  } else {
    ctx.response.status = 404;
    ctx.response.body = "tianditu token not set";
  }
});

router.get("/geocloud", (ctx) => {
  const headers = ctx.request.headers;
  const token = headers.get("tk") || ctx.request.url.searchParams.get("tk");
  if (token) {
    const layersWithToken = geocloud_layers.map((layer) => {
      const newLayer = new MapLayer(
        layer.title,
        layer.abstract,
        layer.id,
        layer.bbox,
        layer.tile_matrix_set,
        layer.url,
        layer.format
      );
      newLayer.set_token("tk", token);
      return newLayer;
    });
    ctx.response.type = "text/xml;charset=UTF-8";
    ctx.response.body = generate_capabilities(
      geocloud_service,
      layersWithToken,
      [geocloud_quad]
    );
  } else {
    ctx.response.status = 404;
    ctx.response.body = "geocloud token not set";
  }
});

router.get("/tianditu/sdhis/:id/:el", (ctx) => {
  const { id, el } = ctx.params;
  const z = parseInt(el);
  const tk = ctx.request.url.searchParams.get("tk") || "";
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body = gen_sd_cap(id, 3, z, tk);
});

router.get("/dist/:filename", async (ctx) => {
  const filename = ctx.params.filename; // 动态获取文件名
  await send(ctx, filename, {
    root: `${Deno.cwd()}/dist`,
  });
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8080;

console.log(`Server runing as http://localhost:${port}`);

app.listen({ hostname: "0.0.0.0", port });
