import {
  Capabilities,
  CRS84TileMatrixSet,
  default_service,
  GeoPoint,
  MapLayer,
} from "@liuxspro/capgen";

const wz_bbox: [GeoPoint, GeoPoint] = [
  { lon: 118.12500556109484, lat: 25.312498793347345 }, // 西南角 (LowerCorner)
  { lon: 123.75000566602114, lat: 30.937498898273667 }, // 东北角 (UpperCorner)
];

interface TileMatrix {
  identifier: string;
  scale_denominator: number;
  top_left_corner: [number, number];
  tile_width: number;
  tile_height: number;
  matrix_width: number;
  matrix_height: number;
}

class CustomCRS84TileMatrixSet extends CRS84TileMatrixSet {
  protected override generateMatrixs(min: number, max: number): TileMatrix[] {
    const tileSize = 256;
    // const baseScale = 559_082_264.028_7178;
    const baseScale = 559_082_274.4575967;
    return Array.from({ length: max - min + 1 }, (_, index) => {
      const zoom = min + index;
      const scale = baseScale / Math.pow(2, zoom);
      const matrixWidth = Math.pow(2, zoom - 6); // 从 zoom 6 开始，每增加一级 zoom，matrixWidth 就翻倍
      const matrixHeight = matrixWidth;
      const topLeftCorner: [number, number] = [
        30.937498898273667,
        118.12500556109484,
      ];
      return {
        identifier: zoom.toString(),
        scale_denominator: Number(scale),
        top_left_corner: topLeftCorner,
        tile_width: tileSize,
        tile_height: tileSize,
        matrix_width: matrixWidth,
        matrix_height: matrixHeight,
      };
    });
  }
}

export const custom_cgcs2000_quad = new CustomCRS84TileMatrixSet(
  "CRS84 for the World",
  "CustomGCS2000Quad",
  "EPSG:4490",
  "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  6,
  19,
);

const host = "https://tdt.wzmap.gov.cn";

const wz_maps = [
  {
    name: "2025年0.5米影像地图",
    id: "CGCS2000_2025yx",
    serviceCode: "4b1f4d30f912a2b9a85249bc87362e88",
  },
  {
    name: "2024年0.5米影像地图",
    id: "CGCS2000_2024yx",
    serviceCode: "e497a434a874585d6ded52b48faa5652",
  },
  {
    name: "2023年0.5米影像地图",
    id: "CGCS2000_2023yx",
    serviceCode: "ab0cd19a92d07e219a89757662047327",
  },
  {
    name: "2022年0.5米影像地图",
    id: "CGCS2000_2022yx",
    serviceCode: "d0c6a532d491edcd4914b32e0c53353f",
  },
  // 2021、2020采用了不同的瓦片矩阵集🤣
];

export const wz_layers = wz_maps.map((map) => {
  return new MapLayer(
    map.name,
    map.name,
    map.id,
    wz_bbox,
    custom_cgcs2000_quad.clone(),
    `${host}/wzmap/${map.id}/default/Custom_${map.id}/{z}/{y}/{x}.png?serviceCode=${map.serviceCode}`,
    "image/png",
  );
});

const cap = new Capabilities(default_service, wz_layers).xml;
export default cap;
