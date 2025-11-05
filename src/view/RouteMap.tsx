import { useAtomValue } from "jotai";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import type { MapRef, StyleSpecification } from "react-map-gl/maplibre";
import { Layer, Map as MapLibre, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import mapStyle from "@/map/gsi-ortho.json";
import { routesAtom, routesGeoJsonAtom, routesRangeAtom } from "@/state/state";

export const RouteMap: FC = () => {
  const routes = useAtomValue(routesAtom);
  const routesGeoJson = useAtomValue(routesGeoJsonAtom);
  const routesRange = useAtomValue(routesRangeAtom);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (mapRef.current && routes.length > 0) {
      const { lat, lng } = routesRange;

      // Add padding to the bounds
      const latPadding = (lat[1] - lat[0]) * 0.1 || 0.01;
      const lngPadding = (lng[1] - lng[0]) * 0.1 || 0.01;

      mapRef.current.fitBounds(
        [
          [lng[0] - lngPadding, lat[0] - latPadding],
          [lng[1] + lngPadding, lat[1] + latPadding],
        ],
        { padding: 50, duration: 1000 },
      );
    }
  }, [routes, routesRange]);

  return (
    <MapLibre
      ref={mapRef}
      initialViewState={{
        longitude: 139.815,
        latitude: 35.61,
        zoom: 10,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={mapStyle as StyleSpecification}
      attributionControl={false}
    >
      {routesGeoJson.map((geoJson, index) => {
        const route = routes[index];
        if (!route.visible) return null;
        return (
          <Source
            key={route.id}
            id={`route-${route.id}`}
            type="geojson"
            data={geoJson}
          >
            <Layer
              id={`route-line-${route.id}`}
              type="line"
              paint={{
                "line-color": route.color,
                "line-width": 6,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        );
      })}

      {routes.map((route) => {
        if (route.waypoints.length === 0 || !route.visible) return null;

        return (
          <Source
            key={`waypoints-${route.id}`}
            id={`waypoints-${route.id}`}
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: route.waypoints.map(([lat, lng]) => ({
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
              })),
            }}
          >
            <Layer
              id={`waypoints-layer-${route.id}`}
              type="circle"
              paint={{
                "circle-radius": 1.5,
                "circle-color": "#ffffff",
                "circle-opacity": 0.8,
              }}
            />
          </Source>
        );
      })}
    </MapLibre>
  );
};
