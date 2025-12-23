import { useAtomValue, useSetAtom, useStore } from "jotai";
import type { FC } from "react";
import { useEffect, useMemo, useRef } from "react";
import type { LngLatBoundsLike, MapRef } from "react-map-gl/maplibre";
import { Layer, Map as MapLibre, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAPS } from "@/map/maps";
import {
  focusedRouteAtom,
  routeConfigFamily,
  routeDataFamily,
  routeGeoJSON,
  routeRange,
  routesAtom,
  routeTangentGeoJSON,
} from "@/state/route";
import { mapStyleAtom } from "@/state/style";

export const MapView: FC = () => {
  const routes = useAtomValue(routesAtom);
  const mapRef = useRef<MapRef>(null);
  const mapStyleID = useAtomValue(mapStyleAtom);
  const focusedRoute = useAtomValue(focusedRouteAtom);
  const setFocusedRoute = useSetAtom(focusedRouteAtom);
  const store = useStore();

  const mapStyle = useMemo(() => {
    return MAPS[mapStyleID] || MAPS["gsi-pale"];
  }, [mapStyleID]);

  const handleMapMove = () => {
    if (focusedRoute !== null) {
      setFocusedRoute(null);
    }
  };

  useEffect(() => {
    if (mapRef.current && focusedRoute) {
      if (mapRef.current) {
        const range = store.get(routeRange(focusedRoute));
        mapRef.current.fitBounds(range as LngLatBoundsLike, {
          padding: 50,
          duration: 1000,
        });
      }
    }
  }, [focusedRoute, store]);

  return (
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
      onDragStart={handleMapMove}
      onZoomStart={handleMapMove}
    >
      {routes.map((id) => (
        <RouteLayer key={id} id={id} />
      ))}
    </MapLibre>
  );
};

const RouteLayer: FC<{ id: string }> = ({ id }) => {
  const route = useAtomValue(routeDataFamily(id));
  const config = useAtomValue(routeConfigFamily(id));
  const geoJSON = useAtomValue(routeGeoJSON(id));
  const tangentGeoJSON = useAtomValue(routeTangentGeoJSON(id));

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

      {/* Tangent lines */}
      {route.route.length > 0 && config.tangent && (
        <Source
          key={`tangent-${id}`}
          id={`tangent-${id}`}
          type="geojson"
          data={tangentGeoJSON}
        >
          <Layer
            id={`tangent-layer-${id}`}
            type="line"
            paint={{
              "line-color": "#ffffff",
              "line-width": 2,
              "line-opacity": 0.8,
            }}
          />
        </Source>
      )}
    </>
  );
};
