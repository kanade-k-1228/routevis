import "maplibre-gl/dist/maplibre-gl.css";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import type { FC } from "react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import MapGL, {
  Layer,
  type MapMouseEvent,
  Marker,
  Source,
} from "react-map-gl/maplibre";
import { MAPS } from "../../map/maps";
import {
  editorModeAtom,
  mapCenterAtom,
  segmentsAtom,
  selectedSegmentIndexAtom,
  selectedWaypointIndexAtom,
  waypointsAtom,
} from "../../state/editor";
import { mapStyleAtom } from "../../state/style";
import type { Waypoint } from "../../type/geometry";
import { MapStyleSelector } from "../common/MapStyleSelector";
import {
  resolveStraight,
  resolveCorner,
  generateSegmentPath,
} from "../../utils/geometry";

export const MapView: FC = () => {
  const [mode, setMode] = useAtom(editorModeAtom);
  const [waypoints, setWaypoints] = useAtom(waypointsAtom);
  const [segments, setSegments] = useAtom(segmentsAtom);
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useAtom(
    selectedWaypointIndexAtom,
  );
  const [selectedSegmentIndex] = useAtom(selectedSegmentIndexAtom);
  const mapStyleID = useAtomValue(mapStyleAtom);
  const [mapCenter, setMapCenter] = useAtom(mapCenterAtom);

  const [hoveredWaypointIndex, setHoveredWaypointIndex] = useState<
    number | null
  >(null);
  const [zoom, setZoom] = useState<number>(16);

  // Initial center (Tokyo Station area)
  const [viewState, setViewState] = useState({
    latitude: 35.681236,
    longitude: 139.767125,
    zoom: 16,
  });

  const waypointsSourceId = useId();
  const waypointsLayerId = useId();
  const segmentsSourceId = useId();
  const segmentsLayerId = useId();

  // Handle Escape key to return to idle mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMode({ mode: "idle" });
        setSelectedWaypointIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMode, setSelectedWaypointIndex]);

  // Handle map center changes from List component
  useEffect(() => {
    if (mapCenter) {
      setViewState({
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        zoom: mapCenter.zoom || 18,
      });
      // Reset the mapCenter atom after using it
      setMapCenter(null);
    }
  }, [mapCenter, setMapCenter]);

  // Get map style
  const mapStyle = useMemo(() => {
    return MAPS[mapStyleID] || MAPS["gsi-pale"];
  }, [mapStyleID]);

  // Map click handler for placing waypoints
  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (mode.mode === "add-point") {
        // Add new waypoint as [lat, lon] array
        const newWaypoint: Waypoint = [lat, lng];
        setWaypoints((prev) => [...prev, newWaypoint]);

        // Add straight segment automatically when adding second or later waypoints
        setSegments((prev) => {
          // Only add segment if this is not the first waypoint
          if (waypoints.length > 0) {
            return [...prev, { type: "straight" }];
          }
          return prev;
        });
      }
    },
    [mode, setWaypoints, setSegments, waypoints.length],
  );

  // Waypoint click handler
  const handleWaypointClick = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent map click
      setSelectedWaypointIndex(index);
    },
    [setSelectedWaypointIndex],
  );

  // Waypoint drag start handler
  const handleWaypointDragStart = useCallback(
    (index: number) => {
      setMode({ mode: "move-point", idx: index });
      setSelectedWaypointIndex(index);
    },
    [setMode, setSelectedWaypointIndex],
  );

  // Waypoint drag handler
  const handleWaypointDrag = useCallback(
    (index: number, lng: number, lat: number) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        updated[index] = [lat, lng];
        return updated;
      });
    },
    [setWaypoints],
  );

  // Waypoint drag end handler
  const handleWaypointDragEnd = useCallback(
    (index: number, lng: number, lat: number) => {
      handleWaypointDrag(index, lng, lat);
      setMode({ mode: "idle" });
    },
    [handleWaypointDrag, setMode],
  );

  // Generate GeoJSON for waypoints connection lines
  const waypointLinesGeoJSON = useMemo(() => {
    if (waypoints.length < 2) {
      return {
        type: "FeatureCollection" as const,
        features: [],
      };
    }

    const coordinates = waypoints.map((wp) => [wp[1], wp[0]]); // [lon, lat] for GeoJSON

    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates,
          },
        },
      ],
    };
  }, [waypoints]);

  // Generate GeoJSON for segments with different styles
  const segmentsGeoJSON = useMemo(() => {
    if (waypoints.length < 2 || segments.length === 0) {
      return {
        type: "FeatureCollection" as const,
        features: [],
      };
    }

    const features = [];

    for (let i = 0; i < Math.min(segments.length, waypoints.length - 1); i++) {
      const segment = segments[i];

      // Resolve segment geometry based on type
      const resolved =
        segment.type === "corner" && waypoints.length >= 4
          ? resolveCorner(waypoints, i, segment.radius)
          : resolveStraight(waypoints, i);

      // Generate path points for the segment
      const pathPoints = generateSegmentPath(
        resolved,
        segment,
        segment.type === "corner" ? 50 : 2,
      );

      // Convert to GeoJSON coordinates [lon, lat]
      const coordinates = pathPoints.map((point) => [point[1], point[0]]);

      features.push({
        type: "Feature" as const,
        properties: {
          segmentType: segment.type,
          radius: segment.type === "corner" ? segment.radius : null,
          index: i,
        },
        geometry: {
          type: "LineString" as const,
          coordinates,
        },
      });
    }

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [waypoints, segments]);

  // Calculate marker size based on zoom level
  const markerSize = useMemo(() => {
    const scaleFactor = 2 ** ((zoom - 16) * 0.3);
    const size = Math.round(16 * scaleFactor); // Reduced from 24 to 16
    return Math.min(Math.max(size, 8), 32); // Adjusted min/max to 8/32
  }, [zoom]);

  return (
    <div className="flex-1 relative">
      <MapStyleSelector />
      <MapGL
        mapStyle={mapStyle}
        mapLib={import("maplibre-gl")}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        onClick={handleMapClick}
        onZoom={(e) => setZoom(e.viewState.zoom)}
      >
        {/* Waypoint connection lines */}
        <Source
          id={waypointsSourceId}
          type="geojson"
          data={waypointLinesGeoJSON}
        >
          <Layer
            id={waypointsLayerId}
            type="line"
            paint={{
              "line-color": "#6b7280",
              "line-width": 2,
              "line-dasharray": [2, 2],
            }}
          />
        </Source>

        {/* Segments with styling */}
        {segments.length > 0 && (
          <Source id={segmentsSourceId} type="geojson" data={segmentsGeoJSON}>
            <Layer
              id={segmentsLayerId}
              type="line"
              paint={{
                "line-color": [
                  "case",
                  ["==", ["get", "segmentType"], "corner"],
                  "#10b981", // green for corners
                  "#3b82f6", // blue for straight
                ],
                "line-width": [
                  "case",
                  ["==", ["get", "index"], selectedSegmentIndex],
                  6,
                  4,
                ],
              }}
            />
          </Source>
        )}

        {/* Waypoint markers */}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={`waypoint-${waypoint[0]}-${waypoint[1]}-${index}`}
            longitude={waypoint[1]}
            latitude={waypoint[0]}
            anchor="center"
            draggable={true}
            onDragStart={() => {
              handleWaypointDragStart(index);
            }}
            onDrag={(e) => {
              const { lng, lat } = e.lngLat;
              handleWaypointDrag(index, lng, lat);
            }}
            onDragEnd={(e) => {
              const { lng, lat } = e.lngLat;
              handleWaypointDragEnd(index, lng, lat);
            }}
          >
            <div
              className={clsx(
                "cursor-pointer",
                "rounded-full",
                "transition-colors duration-200",
                selectedWaypointIndex === index
                  ? "bg-red-500"
                  : hoveredWaypointIndex === index
                    ? "bg-blue-400"
                    : "bg-blue-500",
              )}
              style={{
                width: `${markerSize}px`,
                height: `${markerSize}px`,
                position: "relative",
                zIndex: 10,
              }}
              onClick={(e) => handleWaypointClick(index, e)}
              onMouseEnter={() => setHoveredWaypointIndex(index)}
              onMouseLeave={() => setHoveredWaypointIndex(null)}
            />
          </Marker>
        ))}
      </MapGL>
    </div>
  );
};
