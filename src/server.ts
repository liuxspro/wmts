import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { tianditu_layers } from "./maps/tianditu.ts";
// import { cap as tianditu_js } from "./maps/tianditu_js.ts";
import {
  default_matrix,
  default_service,
  generate_capabilities,
  MapLayer,
} from "./capgen.ts";

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = "On Deno Deploy 💖";
});

// 天地图
router.get("/tianditu", (ctx) => {
  const headers = ctx.request.headers;
  const tdt_tk = headers.get("tdt") || ctx.request.url.searchParams.get("tdt");
  if (tdt_tk) {
    // 创建图层副本并设置token
    const layersWithToken = tianditu_layers.map((layer) => {
      const newLayer = new MapLayer(
        layer.title,
        layer.abstract,
        layer.id,
        layer.bbox,
        layer.tile_matrix_set,
        layer.url
      );
      newLayer.set_token("tk", tdt_tk);
      return newLayer;
    });

    ctx.response.type = "text/xml;charset=UTF-8";
    ctx.response.body = generate_capabilities(
      default_service,
      layersWithToken,
      [default_matrix.WebMercatorQuad, default_matrix.CGCS2000]
    );
  } else {
    ctx.response.status = 404;
    ctx.response.body = "tianditu token not set";
  }
});

// router.get("/js", (ctx) => {
//   ctx.response.type = "";
//   ctx.response.body = tianditu_js;
// });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8080;

console.log(`Server runing as http://localhost:${port}`);

app.listen({ hostname: "0.0.0.0", port });
