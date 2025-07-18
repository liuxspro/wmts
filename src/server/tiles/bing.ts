import { Router } from "jsr:@oak/oak/router";

function tileToQuadkey(x: number, y: number, z: number) {
  if (z === 0) {
    return ""; // 缩放级别0的quadkey为空字符串
  }
  let quadkey = "";
  for (let i = z; i > 0; i--) {
    let digit = 0;
    const mask = 1 << (i - 1);
    if ((x & mask) !== 0) digit += 1;
    if ((y & mask) !== 0) digit += 2;
    quadkey += digit;
  }
  return quadkey;
}

export const router = new Router();

router.get("/tile/bing/:z/:x/:y", (ctx) => {
  const { z, x, y } = ctx.params;
  const quadkey = tileToQuadkey(parseInt(x), parseInt(y), parseInt(z));
  const redirect =
    `https://ecn.t3.tiles.virtualearth.net/tiles/a${quadkey}.jpeg?g=0&dir=dir_n`;

  // 重定向至 redict_url
  ctx.response.redirect(redirect);
});
