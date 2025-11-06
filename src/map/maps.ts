import type { StyleSpecification } from "react-map-gl/maplibre";

import gsiOrthoStyle from "@/map/gsi-ortho.json";
import gsiPaleStyle from "@/map/gsi-pale.json";
import osmDarkStyle from "@/map/osm-dark.json";
import osmDefaultStyle from "@/map/osm-default.json";

export const MAPS: Record<string, StyleSpecification> = {
  "gsi-ortho": gsiOrthoStyle as StyleSpecification,
  "gsi-pale": gsiPaleStyle as StyleSpecification,
  "osm-default": osmDefaultStyle as StyleSpecification,
  "osm-dark": osmDarkStyle as StyleSpecification,
};
