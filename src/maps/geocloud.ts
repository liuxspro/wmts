import {
  default_matrix,
  generate_capabilities,
  generate_crs84_tile_matrixs,
  MapLayer,
  mercator_bbox,
  Service,
  TileMatrixSet,
} from "@liuxspro/capgen";

// https://igss.cgs.gov.cn:6160/igs/rest/ogc/qg50w_20210416_F7qGy9A7/WMTSServer/1.0.0/WMTSCapabilities.xml?tk=您的token
/**
 * 瓦片格式
 * https://igss.cgs.gov.cn:6160/igs/rest/ogc/{LayerId}/WMTSServer?
 * tk={tk}&Width=256&Height=256&layer={LayerId}&style=default&tilematrixset=EPSG%3A4326_{LayerId}_028mm_GB
 * &Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z-1}&TileCol={x}&TileRow={y}
 *
 * https://igss.cgs.gov.cn:6160/igs/rest/ogc/{LayerId}/WMTSServer/1.0.0/{LayerId}/default/EPSG%3A4326_{LayerId}_028mm_GB/4/4/26.png?tk={tk}
 */

const matrix = generate_crs84_tile_matrixs(2, 18);

const matrix_less = matrix.map((t) => {
  const n = t.identifier;
  const less = parseInt(n) - 1;
  t.identifier = String(less);
  return t;
});
// console.log(matrix_less);
export const geocloud_quad: TileMatrixSet = {
  title: "CRS84 for the World",
  id: "WorldCRS84Quad",
  supported_crs: "EPSG:4326",
  wellknown_scale_set:
    "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
  tile_matrixs: matrix_less,
};

export const service: Service = {
  title: "地质云 GeoCloud",
  abstract: "地质云 GeoCloud 服务 By liuxspro@gmail.com",
  keywords: ["地质云", "GeoCloud"],
};

const layers = {
  "qg250w_20210416_ZAZSeOGX": "全国1:250万地质图",
};

export const geocloud_layers: MapLayer[] = [];

const HOST = "https://igss.cgs.gov.cn:6160";

Object.entries(layers).forEach(([key, value]) => {
  geocloud_layers.push(
    new MapLayer(
      value,
      value,
      key,
      mercator_bbox,
      "WorldCRS84Quad",
      `${HOST}/igs/rest/ogc/${key}/WMTSServer/1.0.0/${key}/default/EPSG%3A4326_${key}_028mm_GB/{z}/{y}/{x}.png`,
      "image/png",
    ),
  );
});

export const cap = generate_capabilities(service, geocloud_layers, [
  default_matrix.WorldCRS84Quad,
]);
