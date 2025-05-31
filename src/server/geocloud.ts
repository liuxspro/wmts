import { geocloud_cap } from "../maps/geocloud.ts";
import { Router } from "jsr:@oak/oak/router";

export const router = new Router();

router.get("/geocloud", (ctx) => {
  const headers = ctx.request.headers;
  const token = headers.get("tk") || ctx.request.url.searchParams.get("tk");
  if (token) {
    ctx.response.type = "text/xml;charset=UTF-8";
    ctx.response.body = geocloud_cap(token);
  } else {
    ctx.response.status = 404;
    ctx.response.body = "geocloud token not set";
  }
});
