import { Router } from "jsr:@oak/oak/router";
import { collection } from "../maps/collection.ts";

export const router = new Router();

router.get("/collection", (ctx) => {
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body = collection;
});
