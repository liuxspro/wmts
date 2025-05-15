import {
  geocloud_layers,
  geocloud_quad,
  service as geocloud_service,
} from "../maps/geocloud.ts";
import { Router } from "jsr:@oak/oak/router";
import { generate_capabilities, MapLayer } from "@liuxspro/capgen";
export const router = new Router();

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
