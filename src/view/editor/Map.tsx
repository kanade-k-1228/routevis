import "maplibre-gl/dist/maplibre-gl.css";
import { useAtom, useAtomValue } from "jotai";
import type { FC } from "react";
import { useCallback, useId, useMemo, useState } from "react";
import MapGL, {
  Layer,
  Marker,
  Source,
  type MapMouseEvent,
} from "react-map-gl/maplibre";
import { MAPS } from "../../map/maps";
import { editorStateAtom, originAtom } from "../../state/editor";
import { mapStyleAtom } from "../../state/style";
import type { Position, RouteSegment } from "../../utils/geometry";
import { MapStyleSelector } from "../common/MapStyleSelector";

export const Map: FC<{
  startPosition: Position | null;
  routeSegments: RouteSegment[];
}> = ({ startPosition, routeSegments }) => {
  const [mode, setMode] = useAtom(editorStateAtom);
  const [origin, setOrigin] = useAtom(originAtom);
  const mapStyleID = useAtomValue(mapStyleAtom);

  const [headingPreview, setHeadingPreview] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(16);

  const routeSourceId = useId();
  const arcLayerId = useId();
  const clothoidLayerId = useId();

  // Get map style
  const mapStyle = useMemo(() => {
    return MAPS[mapStyleID] || MAPS["gsi-pale"];
  }, [mapStyleID]);

  // Map click handler
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (mode === "setting-start") {
        // Set start point mode
        setOrigin({
          lat,
          lon: lng,
          bearing: 0,
        });
        setMode("setting-heading");
      } else if (mode === "setting-heading") {
        // Set heading mode
        const dx = lng - origin.lon;
        const dy = lat - origin.lat;
        const heading = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;

        setOrigin({
          ...origin,
          bearing: heading,
        });
        setMode("idle");
        setHeadingPreview(null);
      }
    },
    [mode, origin, setMode, setOrigin],
  );

  // Mouse move preview for heading
  const handleMapMouseMove = useCallback(
    (e: MapMouseEvent) => {
      if (mode === "setting-heading") {
        const { lng, lat } = e.lngLat;
        const dx = lng - origin.lon;
        const dy = lat - origin.lat;
        const heading = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
        setHeadingPreview(heading);
      }
    },
    [mode, origin],
  );

  // Generate GeoJSON data with separate arc and clothoid features
  const generateGeoJSON = useCallback(() => {
    interface GeoJSONFeature {
      type: "Feature";
      properties: { type: string; segmentType: string };
      geometry: {
        type: "LineString";
        coordinates: number[][];
      };
    }
    const features: GeoJSONFeature[] = [];

    // Add arc and clothoid segments separately for color differentiation
    routeSegments.forEach((segment) => {
      // Add arc segment
      if (segment.arcPoints.length > 0) {
        const arcCoordinates = segment.arcPoints.map((p) => [p.lon, p.lat]);
        features.push({
          type: "Feature",
          properties: { type: "route", segmentType: "arc" },
          geometry: {
            type: "LineString",
            coordinates: arcCoordinates,
          },
        });
      }

      // Add clothoid segment
      if (segment.clothoidPoints.length > 0) {
        const clothoidCoordinates = segment.clothoidPoints.map((p) => [
          p.lon,
          p.lat,
        ]);
        features.push({
          type: "Feature",
          properties: { type: "route", segmentType: "clothoid" },
          geometry: {
            type: "LineString",
            coordinates: clothoidCoordinates,
          },
        });
      }
    });

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [routeSegments]);

  const routeGeoJSON = generateGeoJSON();

  // Calculate marker size based on zoom level
  const markerSize = useMemo(() => {
    // Base size at zoom 16
    const baseZoom = 16;
    const scaleFactor = Math.pow(2, (zoom - baseZoom) * 0.3);
    const width = Math.round(6 * scaleFactor); // Base width 6px
    const height = Math.round(12 * scaleFactor); // Base height 12px
    return {
      width: Math.min(Math.max(width, 3), 24), // Clamp between 3-24px
      height: Math.min(Math.max(height, 6), 48), // Clamp between 6-48px
    };
  }, [zoom]);

  return (
    <div className="flex-1 relative">
      <MapStyleSelector />
      <MapGL
        mapStyle={mapStyle}
        mapLib={import("maplibre-gl")}
        initialViewState={{
          latitude: origin.lat,
          longitude: origin.lon,
          zoom: 16,
        }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onClick={handleMapClick}
        onMouseMove={handleMapMouseMove}
        onZoom={(e) => setZoom(e.viewState.zoom)}
      >
        {/* Route display with color differentiation */}
        <Source id={routeSourceId} type="geojson" data={routeGeoJSON}>
          {/* Arc segments - blue */}
          <Layer
            id={arcLayerId}
            type="line"
            filter={["==", ["get", "segmentType"], "arc"]}
            paint={{
              "line-color": "#3b82f6", // blue
              "line-width": 4,
            }}
          />
          {/* Clothoid segments - green */}
          <Layer
            id={clothoidLayerId}
            type="line"
            filter={["==", ["get", "segmentType"], "clothoid"]}
            paint={{
              "line-color": "#10b981", // green
              "line-width": 4,
            }}
          />
        </Source>

        {/* Start point marker */}
        {startPosition && (
          <Marker longitude={origin.lon} latitude={origin.lat} anchor="center">
            <div
              className="flex items-center justify-center relative"
              style={{
                transform: `rotate(${
                  headingPreview !== null ? headingPreview : origin.bearing
                }deg)`,
                transformOrigin: "center",
              }}
            >
              <div
                className="bg-red-500 border border-white absolute"
                style={{
                  width: `${markerSize.width}px`,
                  height: `${markerSize.height}px`,
                }}
              />
            </div>
          </Marker>
        )}
      </MapGL>
    </div>
  );
};
