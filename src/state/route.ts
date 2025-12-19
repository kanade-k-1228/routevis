import { atom } from "jotai";
import { atomFamily, atomWithStorage, useAtomCallback } from "jotai/utils";
import type { Route } from "../type/type";

export const focusedRouteAtom = atom<string | null>(null);

export const routesAtom = atomWithStorage<string[]>("routes", []);
export const routeConfigFamily = atomFamily((id: string) =>
  atomWithStorage<{ color: string; visible: boolean; tangent: boolean }>(
    `route-config-${id}`,
    {
      color: "#3b82f6",
      visible: true,
      tangent: true,
    },
  ),
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

    route.route.forEach(([, lat, lng]) => {
      if (lat < latMin) latMin = lat;
      if (lat > latMax) latMax = lat;
      if (lng < lngMin) lngMin = lng;
      if (lng > lngMax) lngMax = lng;
    });

    return [
      [lngMin, latMin],
      [lngMax, latMax],
    ];
  }),
);

export const allRouteRange = atom((get) => {
  const ids = get(routesAtom);
  let latMin = Infinity;
  let latMax = -Infinity;
  let lngMin = Infinity;
  let lngMax = -Infinity;
  ids.forEach((id) => {
    const [[lngmin, latmin], [lngmax, latmax]] = get(routeRange(id));
    if (latmin < latMin) latMin = latmin;
    if (latmax > latMax) latMax = latmax;
    if (lngmin < lngMin) lngMin = lngmin;
    if (lngmax > lngMax) lngMax = lngmax;
  });
  return [
    [lngMin, latMin],
    [lngMax, latMax],
  ];
});

export const routeGeoJSON = atomFamily((id: string) =>
  atom((get) => {
    const route = get(routeDataFamily(id));
    const config = get(routeConfigFamily(id));

    const geoJSON = {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: route.route.map(([, lat, lng]) => [lng, lat]),
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

const calcDest = (
  lat: number,
  lng: number,
  bearing: number,
  length: number,
): [number, number] => {
  const R = 6371000; // 地球の半径（メートル）
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lng * Math.PI) / 180;
  const θ = (bearing * Math.PI) / 180;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(length / R) +
      Math.cos(φ1) * Math.sin(length / R) * Math.cos(θ),
  );

  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(length / R) * Math.cos(φ1),
      Math.cos(length / R) - Math.sin(φ1) * Math.sin(φ2),
    );

  return [(φ2 * 180) / Math.PI, (λ2 * 180) / Math.PI];
};

export const routeTangentGeoJSON = atomFamily((id: string) =>
  atom((get) => {
    const route = get(routeDataFamily(id));
    const length = 1.5;
    return {
      type: "FeatureCollection" as const,
      features: route.route
        .filter((_, i) => i % 5 === 0) // Sampling
        .map(([, lat, lng, bearing]) => {
          const [endLat, endLng] = calcDest(lat, lng, bearing, length);
          return {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "LineString" as const,
              coordinates: [
                [lng, lat],
                [endLng, endLat],
              ],
            },
          };
        }),
    };
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
        config: { color: string; visible: boolean; tangent: boolean };
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

export const useFocusRoute = () => {
  return useAtomCallback((_get, set, id: string) => {
    set(focusedRouteAtom, id);
  });
};
