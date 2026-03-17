// https://tiles.emodnet-bathymetry.eu

import {
  Capabilities,
  MapLayer,
  mercator_bbox,
  Service,
  web_mercator_quad,
} from "@liuxspro/capgen";

export const service: Service = {
  title: "EMODnet Bathymetry",
  abstract: "EMODnet Bathymetry",
  keywords: ["EMODnet", "Bathymetry"],
};

const baselayer = new MapLayer(
  "EMODnet - Global land and water coverage",
  "30 arc second compilation of EMODnet Bathymetry 2018, GEBCO 2019 and various land DEM sources (ASTER, SRTM, EU DEM and viewfinderspanoramas.org) in traditional atlas style colours",
  "emodnet_baselayer",
  mercator_bbox,
  web_mercator_quad.clone().setZoom(1, 10),
  "https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{TileMatrix}/{TileCol}/{TileRow}.png",
  "image/png",
);

export const layers = [baselayer];

const cap = new Capabilities(service, layers).xml;

export default cap;
