import gs from "../maps/hubgs.ts";
import osm from "../maps/osm.ts";
import esri from "../maps/esri.ts";
import debug from "../maps/debug.ts";

import { collection } from "../maps/collection.ts";
import { create_router } from "../utils.ts";

export const hubgs_router = create_router(gs);
export const osm_router = create_router(osm);
export const esri_router = create_router(esri);
export const collection_router = create_router(collection);
export const debug_router = create_router(debug);
