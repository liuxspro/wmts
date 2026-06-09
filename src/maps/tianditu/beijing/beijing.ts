import beijing_maps from "./beijing.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  CRS84TileMatrixSet,
  MapLayer,
  Service,
  TileMatrix,
} from "@liuxspro/capgen";
import { zoomToScale } from "./scale.ts";

const beijing_bbox: BBox = [
  [115.413811, 39.443493], // 西南角 (LowerCorner)
  [117.506111, 41.058609], // 东北角 (UpperCorner)
];

// 1951、1966、1996年影像范围
const beijing_old_bbox: BBox = [
  [116.28899792, 39.82830693],
  [116.47452581, 39.98153392],
];

// 使用 scale 表示 zoom
class CustomCRS84TileMatrixSet extends CRS84TileMatrixSet {
  protected override generateMatrixs(
    minZoom: number,
    maxZoom: number,
  ): TileMatrix[] {
    const tileSize = 256;
    const baseScale = 559_082_264.028_7178;
    return Array.from({ length: maxZoom - minZoom + 1 }, (_, index) => {
      const zoom = minZoom + index;
      const scale = baseScale / Math.pow(2, zoom);
      const matrixWidth = Math.pow(2, zoom);

      // CRS特定配置
      const matrixHeight = matrixWidth / 2;
      const topLeftCorner: [number, number] = [90, -180]; // EPSG:4326

      return {
        identifier: `${zoomToScale(zoom)}`,
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

const custom_cgcs2000_quad = new CustomCRS84TileMatrixSet(
  "CRS84 for the World",
  "CustomGCS2000Quad",
  "EPSG:4490",
  "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  6,
  18,
);

const custom_cgcs2000_quadF6T16 = new CustomCRS84TileMatrixSet(
  "CRS84 for the World",
  "CustomGCS2000QuadF6T16",
  "EPSG:4490",
  "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  6,
  16,
);

const bj_layers = beijing_maps.map((map) => {
  const bbox = map.id <= 65 ? beijing_old_bbox : beijing_bbox;
  const quad = map.id <= 65 ? custom_cgcs2000_quadF6T16 : custom_cgcs2000_quad;
  return new MapLayer(
    `北京 ${map.name}`,
    `${map.name}`,
    `beijing_${map.id}`,
    bbox,
    quad,
    `${map.serUrl}/tileImage.png?width=256&height=256&redirect=false&transparent=true&cacheEnabled=true&origin=%7B%22x%22:-180,%22y%22:90%7D&overlapDisplayed=false&scale={z}&x={x}&y={y}`,
    "image/jpeg",
  );
});
export const service: Service = {
  title: "天地图 北京",
  abstract: "天地图 北京 历史影像",
  keywords: ["天地图", "北京", "历史影像"],
};

const cap = new Capabilities(service, bj_layers).xml;
export default cap;
