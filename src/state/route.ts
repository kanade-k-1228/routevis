import { atom } from "jotai";
import { atomFamily, atomWithStorage, useAtomCallback } from "jotai/utils";
import type { Route } from "../type/type";

export const routesAtom = atomWithStorage<string[]>("routes", []);
export const routeConfigFamily = atomFamily((id: string) =>
  atomWithStorage<{ color: string; visible: boolean }>(`route-config-${id}`, {
    color: "#3b82f6",
    visible: true,
  }),
);
export const routeDataFamily = atomFamily((id: string) =>
  atomWithStorage<Route>(`route-data-${id}`, { route: [] }),
);

export const routeRange = atomFamily((id: string) =>
  atom((get) => {
    const route = get(routeDataFamily(id));
    let latMin = Infinity;
    let latMax = -Infinity;
    let lngMin = Infinity;
    let lngMax = -Infinity;

    route.route.forEach(([, , lat, lng]) => {
      if (lat < latMin) latMin = lat;
      if (lat > latMax) latMax = lat;
      if (lng < lngMin) lngMin = lng;
      if (lng > lngMax) lngMax = lng;
    });

    return {
      lat: [latMin, latMax],
      lng: [lngMin, lngMax],
    };
  }),
);

export const routeGeoJSON = atomFamily((id: string) =>
  atom((get) => {
    const route = get(routeDataFamily(id));
    const config = get(routeConfigFamily(id));

    const geoJSON = {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: route.route.map(([, , lat, lng]) => [lng, lat]),
      },
      properties: {
        id: id,
        name: id,
        color: config.color,
      },
    };

    return geoJSON;
  }),
);

export const useAddRoute = () => {
  return useAtomCallback(
    (
      get,
      set,
      params: {
        id: string;
        data: Route;
        config: { color: string; visible: boolean };
      },
    ) => {
      const { id, data, config } = params;

      // Set route data
      set(routeDataFamily(id), data);

      // Set route config
      set(routeConfigFamily(id), config);

      // Add ID to the list if not already present
      const currentIDs = get(routesAtom);
      if (!currentIDs.includes(id)) {
        set(routesAtom, [...currentIDs, id]);
      }
    },
  );
};

export const useDeleteRoute = () => {
  return useAtomCallback((get, set, id: string) => {
    const currentIDs = get(routesAtom);
    set(
      routesAtom,
      currentIDs.filter((routeId) => routeId !== id),
    );

    // Clear route data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(`route-data-${id}`);
      localStorage.removeItem(`route-config-${id}`);
    }
  });
};
