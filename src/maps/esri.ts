import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

const HOST = "https://server.arcgisonline.com/arcgis/rest/services";
const xyzpath = "MapServer/tile/{z}/{y}/{x}";

const maps = {
  "World Imagery": `${HOST}/World_Imagery/${xyzpath}`,
  "World Ocean Base": `${HOST}/Ocean/World_Ocean_Base/${xyzpath}`,
  "World Terrain Base": `${HOST}/World_Terrain_Base/${xyzpath}`,
  "World Physical Map": `${HOST}/World_Physical_Map/${xyzpath}`,
  "World Hillshade": `${HOST}/Elevation/World_Hillshade/${xyzpath}`,
  "World Light Gray": `${HOST}/Canvas/World_Light_Gray_Base/${xyzpath}`,
};

export const esri_layers: MapLayer[] = [];

Object.entries(maps).forEach(([key, value]) => {
  esri_layers.push(
    new MapLayer(
      `ERSI ${key}`,
      `ERSI ${key}`,
      `esri_${key.replaceAll(" ", "")}`,
      mercator_bbox,
      web_mercator_quad.clone(),
      value,
      "image/jpeg",
    ),
  );
});

export const service: Service = {
  title: "ESRI Maps",
  abstract: "ESRI Maps",
  keywords: ["ESRI"],
};

export const cap = new Capabilities(service, esri_layers).xml;
