import { Environment } from "npm:minijinja-js";
import { base } from "./template.ts";

export interface Service {
  title: string;
  abstract: string;
  keywords: string[];
}

export type DefaultTileMatrixSetName =
  | "WebMercatorQuad"
  | "WorldCRS84Quad"
  | "CGCS2000Quad";
export type CRS_Point = { lon: number; lat: number };

export interface Layer {
  title: string;
  abstract: string;
  id: string;
  bbox: [CRS_Point, CRS_Point];
  tile_matrix_set: DefaultTileMatrixSetName;
  wmts_url: string;
}

export type Layers = Layer[];

/**
 * TileMatrix 结构定义
 */
export interface TileMatrix {
  identifier: string;
  scale_denominator: number;
  top_left_corner: [number, number];
  tile_width: number;
  tile_height: number;
  matrix_width: number;
  matrix_height: number;
}

export interface TileMatrixSet {
  title: string;
  id: string;
  supported_crs: string;
  wellknown_scale_set: string;
  tile_matrixs: TileMatrix[];
}

/**
 * 生成瓦片矩阵集
 * @param minZoom - 起始级别 (包含)
 * @param maxZoom - 最大级别 (包含)
 * @returns 返回 TileMatrix 集合
 */
export function generate_tile_matrixs(
  minZoom: number,
  maxZoom: number
): TileMatrix[] {
  if (!Number.isInteger(minZoom) || !Number.isInteger(maxZoom)) {
    throw new Error("Zoom levels must be integers");
  }

  return Array.from({ length: maxZoom - minZoom + 1 }, (_, index) => {
    const zoom = minZoom + index;
    const BASE_SCALE: number = 559_082_264.028_7178;
    const scale = BASE_SCALE / Math.pow(2, zoom);

    const matrix_size = Math.pow(2, zoom);

    return {
      identifier: zoom.toString(),
      scale_denominator: Number(scale),
      top_left_corner: [-20037508.3427892, 20037508.3427892],
      tile_width: 256,
      tile_height: 256,
      matrix_width: matrix_size,
      matrix_height: matrix_size,
    };
  });
}

export function generate_crs84_tile_matrixs(
  minZoom: number,
  maxZoom: number
): TileMatrix[] {
  if (!Number.isInteger(minZoom) || !Number.isInteger(maxZoom)) {
    throw new Error("Zoom levels must be integers");
  }

  return Array.from({ length: maxZoom - minZoom + 1 }, (_, index) => {
    const zoom = minZoom + index;
    const BASE_SCALE: number = 559_082_264.028_7178;
    const scale = BASE_SCALE / Math.pow(2, zoom);

    const matrix_width = Math.pow(2, zoom);
    const matrix_height = matrix_width / 2;

    return {
      identifier: zoom.toString(),
      scale_denominator: Number(scale),
      top_left_corner: [90, -180], // 使用EPSG:4326 (纬度，经度)
      tile_width: 256,
      tile_height: 256,
      matrix_width: matrix_width,
      matrix_height: matrix_height,
    };
  });
}

export function generate_capabilities(
  service: Service,
  layers: Layers | MapLayer[],
  tile_matrix_sets: TileMatrixSet[]
) {
  const env = new Environment();
  env.trimBlocks = true;
  env.lstripBlocks = true;
  env.debug = true;

  const result = env.renderStr(base, {
    service,
    layers,
    tile_matrix_sets,
  });
  return result;
}

export const default_service: Service = {
  title: "Simple WMTS",
  abstract: "Simple WMTS",
  keywords: ["WMTS"],
};

// 常用瓦片矩阵集
// https://docs.ogc.org/is/17-083r2/17-083r2.html#73
const web_mercator_quad: TileMatrixSet = {
  title: "Google Maps Compatible for the World",
  id: "WebMercatorQuad",
  supported_crs: "EPSG:3857",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/GoogleMapsCompatible",
  tile_matrixs: generate_tile_matrixs(0, 18),
};

// https://docs.ogc.org/is/17-083r2/17-083r2.html#76
// 此处使用了 EPSG:4326 变体
const world_crs84_quad: TileMatrixSet = {
  title: "CRS84 for the World",
  id: "WorldCRS84Quad",
  supported_crs: "EPSG:4326",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  tile_matrixs: generate_crs84_tile_matrixs(1, 18),
};
// 与 EPSG:4326 基本一样
const cgcs2000_quad: TileMatrixSet = {
  title: "CRS84 for the World",
  id: "CGCS2000Quad",
  supported_crs: "EPSG:4490",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  tile_matrixs: generate_crs84_tile_matrixs(1, 18),
};

export const default_matrix = {
  WebMercatorQuad: web_mercator_quad,
  WorldCRS84Quad: world_crs84_quad,
  CGCS2000: cgcs2000_quad,
};

export const mercator_bbox: [CRS_Point, CRS_Point] = [
  { lon: -180.0, lat: -85.051129 }, // 西南角 (LowerCorner)
  { lon: 180.0, lat: 85.051129 }, // 东北角 (UpperCorner)
];

function trans_url(url: string) {
  return url
    .replace(/\{z\}/g, "{TileMatrix}")
    .replace(/\{x\}/g, "{TileCol}")
    .replace(/\{y\}/g, "{TileRow}")
    .replace(/&/g, "&amp;")
    .replace(/\|/g, "%7C");
}

export class MapLayer {
  wmts_url: string;
  /**
   *
   * @param title 地图名称
   * @param abstract 摘要
   * @param id 唯一id
   * @param bbox 边界框
   * @param tile_matrix_set 瓦片集名称
   * @param url 原始的url 包含{z}/{x}/{y}
   */
  constructor(
    public title: string,
    public abstract: string,
    public id: string,
    public bbox: [CRS_Point, CRS_Point],
    public tile_matrix_set: DefaultTileMatrixSetName | string,
    public url: string
  ) {
    this.wmts_url = trans_url(url);
  }

  set_title(title: string) {
    this.title = title;
  }

  set_url(new_url: string) {
    this.url = trans_url(new_url);
  }

  set_token(tk_name: string = "tk", token: string) {
    // Add new token parameter
    this.wmts_url = trans_url(this.url + `&${tk_name}=${token}`);
  }
}
