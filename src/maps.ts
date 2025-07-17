import { debug } from "./maps/debug.ts";
import { cap as google } from "./maps/google_map.ts";
import { cap as tianditu_js } from "./maps/tianditu/jiangsu.ts";
import { cap as xuzhou } from "./maps/tianditu/jiangsu_xuzhou.ts";
import { cap as osm } from "./maps/osm.ts";
import { cap as shipxy } from "./maps/shipxy.ts";
import { cap as amap } from "./maps/amap.ts";
import { cap as beijing } from "./maps/tianditu/beijing.ts";
import { cap as esri } from "./maps/esri.ts";
import { cap as gggis } from "./maps/gggis.ts";
import { cap as jl } from "./maps/tianditu/jilin.ts";
import { cap as yandex } from "./maps/yandex.ts";
import { collection } from "./maps/collection.ts";

export const maps = {
  debug,
  google,
  tianditu_js,
  xuzhou,
  osm,
  shipxy,
  amap,
  beijing,
  esri,
  gggis,
  jl,
  yandex,
  collection,
};
