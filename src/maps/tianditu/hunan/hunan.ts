import hunan_maps from "./hunan.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  CRS84TileMatrixSet,
  MapLayer,
  Service,
  TileMatrix,
} from "@liuxspro/capgen";

const hn_bbox: BBox = [
  [108.78311200, 24.63442600],
  [115.545019, 30.563407],
];

function zoomToScale(zoom: number): number {
  return (256 * Math.pow(2, zoom) * 0.0254 / 96) / (2 * Math.PI * 6378137);
}

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
  7,
  18,
);

const hn_layers = hunan_maps.map((map) => {
  const url =
    `${map.url}/tileImage.png?origin=%7B%22x%22%3A-180%2C%22y%22%3A90%7D&x={x}&y={y}&scale={z}`;
  return new MapLayer(
    `湖南 ${map.name}`,
    `湖南 ${map.name}`,
    `${map.id}`,
    hn_bbox,
    custom_cgcs2000_quad,
    url,
    "image/jpeg",
  );
});

export const service: Service = {
  title: "天地图 湖南",
  abstract: "天地图 湖南 历史影像",
  keywords: ["天地图", "湖南苏", "历史影像"],
};

const cap = new Capabilities(service, hn_layers).xml;
export default cap;
