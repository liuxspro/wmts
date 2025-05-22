import { debug } from "./maps/debug.ts";
import { cap as google } from "./maps/google_map.ts";
import { cap as tianditu_js } from "./maps/tianditu_js.ts";
import { cap as xuzhou } from "./maps/tianditu_js_xz.ts";
import { cap as osm } from "./maps/osm.ts";
import { cap as shipxy } from "./maps/shipxy.ts";
import { cap as amap } from "./maps/amap.ts";
import { cap as beijing } from "./maps/tianditu/beijing.ts";

export const maps = {
  debug,
  google,
  tianditu_js,
  xuzhou,
  osm,
  shipxy,
  amap,
  beijing,
};
