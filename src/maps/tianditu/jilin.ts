import {
  Capabilities,
  cgcs2000_quad,
  default_service,
  GeoPoint,
  MapLayer,
} from "@liuxspro/capgen";

const jl_bbox: [GeoPoint, GeoPoint] = [
  { lon: 121.149676, lat: 39.533551 }, // 西南角 (LowerCorner)
  { lon: 131.791571, lat: 47.134905 }, // 东北角 (UpperCorner)
];

const jl_2024 = new MapLayer(
  "吉林2024影像",
  "吉林2024影像",
  "jl_2024",
  jl_bbox,
  cgcs2000_quad.clone(),
  "https://jilin.tianditu.gov.cn/ime-cloud/rest/JLS_DOM202406/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=JLS_DOM202406&STYLE=default&FORMAT=image%2Fjpgpng&TILEMATRIXSET=default028mm&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
  "image/jpgpng",
);

export const cap = new Capabilities(default_service, [jl_2024]).xml;
