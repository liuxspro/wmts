import {
  Capabilities,
  default_service,
  MapLayer,
  mercator_bbox,
  world_crs84_quad_less,
} from "@liuxspro/capgen";

// See https://siyouhua.gggis.com/api/image.html
const gggis_earth_new = new MapLayer(
  "Google Earth (无水印高清影像)",
  "谷谷地球 无水印高清影像",
  "gggis_google_new",
  mercator_bbox,
  world_crs84_quad_less.clone(),
  "https://tileser.giiiis.com/new/{z}/{x}/{y}.jpg",
  "image/jpeg",
);

// See https://siyouhua.gggis.com/api/zuixin.html
const gggis_earth_timetile = new MapLayer(
  "Google Earth (最新影像)",
  "谷谷地球 最新影像",
  "gggis_google_time",
  mercator_bbox,
  world_crs84_quad_less.clone(),
  "https://tileser.giiiis.com/timetile/0/{z}/{x}/{y}.jpg",
  "image/jpeg",
);

export const gggis_erath = [gggis_earth_new, gggis_earth_timetile];

export const cap = new Capabilities(
  default_service,
  gggis_erath,
).xml;
