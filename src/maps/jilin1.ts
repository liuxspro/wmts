import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

// https://www.jl1mall.com/rskit/MyRSservice 我的套件
// https://www.jl1mall.com/rskit/RSsserviceManage 查看套件明细
// 基于WMTS方式加载（官方） https://api.jl1mall.com/getCapabilities?mk=图层 MK&tk=套件TK

const config = {
  tile_url:
    "https://api.jl1mall.com/getMap?TileMatrix={z}&TileCol={x}&TileRow={y}&sch=wmts&route=1&mk={mk}",
  format: "image/jpeg",
  layers: [
    { year: 2022, mk: "bd60ffe96379e0c9cbc1be02b06e3622" },
    { year: 2023, mk: "73ad26c4aa6957eef051ecc5a15308b4" },
    { year: 2024, mk: "3ddec00f5f435270285ffc7ad1a60ce5" },
    { year: 2025, mk: "87ef1846fbacfb91a8f45eff68115cd7" },
  ],
};

export const layers = config.layers.map((layer) => {
  const title = `吉林一号 - ${layer.year}年度全国高质量一张图`;
  return new MapLayer(
    title,
    title,
    `jl1_${layer.year}`,
    mercator_bbox,
    web_mercator_quad.clone(),
    config.tile_url.replaceAll("{mk}", layer.mk),
    config.format,
  );
});

export const service: Service = {
  title: "吉林一号",
  abstract: "吉林一号",
  keywords: ["吉林一号"],
};

export function jl1_cap(token: string) {
  return new Capabilities(
    service,
    layers.map((layer) => {
      layer.set_token("tk", token);
      return layer;
    }),
  ).xml;
}
