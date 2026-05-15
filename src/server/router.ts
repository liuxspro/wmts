import gs from "../maps/hubgs.ts";
import osm from "../maps/osm.ts";
import esri from "../maps/esri.ts";
import { create_router } from "../utils.ts";

export const hubgs_router = create_router(gs);
export const osm_router = create_router(osm);
export const esri_router = create_router(esri);
