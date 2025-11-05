import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Route } from "../type/type";

export const routesAtom = atomWithStorage<Route[]>("routes", []);

export const routesRangeAtom = atom((get) => {
  const routes = get(routesAtom);
  let latMin = Infinity;
  let latMax = -Infinity;
  let lngMin = Infinity;
  let lngMax = -Infinity;

  routes.forEach((route) => {
    route.waypoints.forEach(([lat, lng]) => {
      if (lat < latMin) latMin = lat;
      if (lat > latMax) latMax = lat;
      if (lng < lngMin) lngMin = lng;
      if (lng > lngMax) lngMax = lng;
    });
  });

  if (latMin === Infinity) {
    return {
      lat: [0, 0],
      lng: [0, 0],
    };
  }

  return {
    lat: [latMin, latMax],
    lng: [lngMin, lngMax],
  };
});

interface GeoJsonFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: {
    id: string;
    name: string;
    color: string;
  };
}

export const routesGeoJsonAtom = atom((get) => {
  const routes = get(routesAtom);
  return routes.map((route) => routeToGeoJson(route));
});

const routeToGeoJson = (route: Route): GeoJsonFeature => {
  return {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: route.waypoints.map(([lat, lng]) => [lng, lat]),
    },
    properties: {
      id: route.id,
      name: route.name,
      color: route.color,
    },
  };
};
