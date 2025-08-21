import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const jl1_2023 = new MapLayer(
  "吉林一号 - 2023年度全国高质量一张图",
  "吉林一号 - 2023年度全国高质量一张图",
  "jl1_2023",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://api.jl1mall.com/getMap?TileMatrix={z}&TileCol={x}&TileRow={y}&sch=wmts&route=1&mk=73ad26c4aa6957eef051ecc5a15308b4",
  "image/jpeg",
);

const jl1_2024 = new MapLayer(
  "吉林一号 - 2024年度全国高质量一张图",
  "吉林一号 - 2024年度全国高质量一张图",
  "jl1_2024",
  mercator_bbox,
  web_mercator_quad.clone(),
  "https://api.jl1mall.com/getMap?TileMatrix={z}&TileCol={x}&TileRow={y}&sch=wmts&route=1&mk=3ddec00f5f435270285ffc7ad1a60ce5",
  "image/jpeg",
);

export const layers = [jl1_2023, jl1_2024];

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

// export const cap = new Capabilities(service, layers).xml;
