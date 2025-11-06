import { useAtomValue } from "jotai";
import type { FC } from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import type { MapRef, StyleSpecification } from "react-map-gl/maplibre";
import { Layer, Map as MapLibre, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  routesAtom,
  routeDataFamily,
  routeConfigFamily,
  routeGeoJSON,
} from "@/state/state";
import { MapStyleSelector } from "./MapStyleSelector";

// Import all map styles
import gsiOrthoStyle from "@/map/gsi-ortho.json";
import gsiPaleStyle from "@/map/gsi-pale.json";
import osmDefaultStyle from "@/map/osm-default.json";
import osmDarkStyle from "@/map/osm-dark.json";

const MAP_STYLES_DATA: Record<string, StyleSpecification> = {
  "gsi-ortho": gsiOrthoStyle as StyleSpecification,
  "gsi-pale": gsiPaleStyle as StyleSpecification,
  "osm-default": osmDefaultStyle as StyleSpecification,
  "osm-dark": osmDarkStyle as StyleSpecification,
};

export const RouteMap: FC = () => {
  const routes = useAtomValue(routesAtom);
  const mapRef = useRef<MapRef>(null);
  const [currentStyleId, setCurrentStyleId] = useState<string>("gsi-ortho");

  const mapStyle = useMemo(() => {
    return MAP_STYLES_DATA[currentStyleId] || MAP_STYLES_DATA["gsi-ortho"];
  }, [currentStyleId]);

  // Fit bounds based on all route data
  useEffect(() => {
    if (mapRef.current && routes.length > 0) {
      // We'll use a timeout to ensure data is loaded
      const timer = setTimeout(() => {
        // Get all route data from localStorage directly
        let latMin = Infinity;
        let latMax = -Infinity;
        let lngMin = Infinity;
        let lngMax = -Infinity;
        let hasData = false;

        routes.forEach((id) => {
          const storedData = localStorage.getItem(`route-data-${id}`);
          if (storedData) {
            try {
              const data = JSON.parse(storedData);
              if (data.log && Array.isArray(data.log)) {
                data.log.forEach(([, , lat, lng]: number[]) => {
                  if (typeof lat === "number" && typeof lng === "number") {
                    hasData = true;
                    if (lat < latMin) latMin = lat;
                    if (lat > latMax) latMax = lat;
                    if (lng < lngMin) lngMin = lng;
                    if (lng > lngMax) lngMax = lng;
                  }
                });
              }
            } catch (e) {
              console.error(`Failed to parse route data for ${id}`, e);
            }
          }
        });

        if (hasData && mapRef.current) {
          // Add padding to the bounds
          const latPadding = (latMax - latMin) * 0.1 || 0.01;
          const lngPadding = (lngMax - lngMin) * 0.1 || 0.01;

          mapRef.current.fitBounds(
            [
              [lngMin - lngPadding, latMin - latPadding],
              [lngMax + lngPadding, latMax + latPadding],
            ],
            { padding: 50, duration: 1000 },
          );
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [routes]);

  const handleStyleChange = (styleId: string) => {
    setCurrentStyleId(styleId);
  };

  return (
    <>
      <MapStyleSelector
        currentStyle={currentStyleId}
        onStyleChange={handleStyleChange}
      />
      <MapLibre
        ref={mapRef}
        initialViewState={{
          longitude: 139.815,
          latitude: 35.61,
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        attributionControl={false}
      >
        {routes.map((id) => (
          <RouteLayer key={id} id={id} />
        ))}
      </MapLibre>
    </>
  );
};

const RouteLayer: FC<{ id: string }> = ({ id }) => {
  const route = useAtomValue(routeDataFamily(id));
  const config = useAtomValue(routeConfigFamily(id));
  const geoJSON = useAtomValue(routeGeoJSON(id));

  if (!config.visible) return null;

  return (
    <>
      <Source
        key={`route-${id}`}
        id={`route-${id}`}
        type="geojson"
        data={geoJSON}
      >
        <Layer
          id={`route-line-${id}`}
          type="line"
          paint={{
            "line-color": config.color,
            "line-width": 6,
            "line-opacity": 0.8,
          }}
        />
      </Source>

      {/* Waypoints */}
      {route.log.length > 0 && (
        <Source
          key={`waypoints-${id}`}
          id={`waypoints-${id}`}
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: route.log.map(([, , lat, lng]) => ({
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
            id={`waypoints-layer-${id}`}
            type="circle"
            paint={{
              "circle-radius": 1.5,
              "circle-color": "#ffffff",
              "circle-opacity": 0.8,
            }}
          />
        </Source>
      )}
    </>
  );
};
