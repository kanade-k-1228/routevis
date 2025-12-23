import clsx from "clsx";
import { useAtom } from "jotai";
import {
  Check,
  Download,
  Plus,
  RefreshCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { type FC, useCallback, useState } from "react";
import type { Segment } from "@/type/geometry";
import {
  editorModeAtom,
  mapCenterAtom,
  segmentsAtom,
  selectedSegmentIndexAtom,
  selectedWaypointIndexAtom,
  waypointsAtom,
} from "../../state/editor";

export const List: FC = () => {
  const [mode, setMode] = useAtom(editorModeAtom);
  const [waypoints, setWaypoints] = useAtom(waypointsAtom);
  const [segments, setSegments] = useAtom(segmentsAtom);
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useAtom(
    selectedWaypointIndexAtom,
  );
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useAtom(
    selectedSegmentIndexAtom,
  );
  const [, setMapCenter] = useAtom(mapCenterAtom);

  const [cornerRadius] = useState<number>(5);

  // Handle waypoint row click to center map
  const handleWaypointRowClick = useCallback(
    (index: number) => {
      const waypoint = waypoints[index];
      if (waypoint) {
        setSelectedWaypointIndex(index);
        setMapCenter({ lat: waypoint[0], lng: waypoint[1], zoom: 18 });
      }
    },
    [waypoints, setSelectedWaypointIndex, setMapCenter],
  );

  // Clear all data
  const clearRoute = useCallback(() => {
    setWaypoints([]);
    setSegments([]);
    setSelectedWaypointIndex(-1);
    setSelectedSegmentIndex(-1);
    setMode({ mode: "idle" });
  }, [
    setWaypoints,
    setSegments,
    setSelectedWaypointIndex,
    setSelectedSegmentIndex,
    setMode,
  ]);

  // Delete specific waypoint
  const deleteWaypoint = useCallback(
    (index: number) => {
      setWaypoints((prev) => prev.filter((_, i) => i !== index));
      // Also remove associated segment if it exists
      if (segments.length > index) {
        setSegments((prev) => prev.filter((_, i) => i !== index));
      }
      if (selectedWaypointIndex === index) {
        setSelectedWaypointIndex(-1);
      }
    },
    [
      segments.length,
      selectedWaypointIndex,
      setWaypoints,
      setSegments,
      setSelectedWaypointIndex,
    ],
  );

  // Update waypoint coordinates
  const updateWaypoint = useCallback(
    (index: number, field: "lat" | "lon", value: number) => {
      setWaypoints((prev) => {
        const updated = [...prev];
        const waypoint = [...updated[index]];
        if (field === "lat") {
          waypoint[0] = value;
        } else if (field === "lon") {
          waypoint[1] = value;
        }
        updated[index] = waypoint as any;
        return updated;
      });
    },
    [setWaypoints],
  );

  // Update segment
  const updateSegment = useCallback(
    (index: number, segment: Segment) => {
      setSegments((prev) => {
        const updated = [...prev];
        updated[index] = segment;
        return updated;
      });
    },
    [setSegments],
  );

  // Export to JSON
  const exportRoute = useCallback(() => {
    if (waypoints.length === 0) {
      alert("No route to export");
      return;
    }

    const exportData = {
      waypoints: waypoints,
      segments: segments,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `route_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [waypoints, segments]);

  // Import from JSON
  const importRoute = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);

          // Validate structure
          if (!data.waypoints || !Array.isArray(data.waypoints)) {
            alert("Invalid JSON: waypoints array is required");
            return;
          }

          // Set waypoints (convert to [lat, lon] format if needed)
          const importedWaypoints = data.waypoints.map((wp: any) => {
            if (Array.isArray(wp)) {
              // If it's an array, take only lat and lon
              return [wp[0], wp[1]];
            } else if (wp.lat !== undefined && wp.lon !== undefined) {
              return [wp.lat, wp.lon];
            } else {
              throw new Error("Invalid waypoint format");
            }
          });

          setWaypoints(importedWaypoints);

          // Set segments if provided
          if (data.segments && Array.isArray(data.segments)) {
            setSegments(data.segments);
          } else {
            // Auto-generate straight segments if not provided
            const newSegments: Segment[] = [];
            for (let i = 0; i < importedWaypoints.length - 1; i++) {
              newSegments.push({ type: "straight" } as Segment);
            }
            setSegments(newSegments);
          }

          // Reset selection
          setSelectedWaypointIndex(-1);
          setSelectedSegmentIndex(-1);
          setMode({ mode: "idle" });
        } catch (error) {
          alert(`Failed to parse JSON file: ${error}`);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }, [
    setWaypoints,
    setSegments,
    setSelectedWaypointIndex,
    setSelectedSegmentIndex,
    setMode,
  ]);

  return (
    <div className="w-[600px] bg-slate-900 text-white p-4 overflow-y-auto h-full">
      {waypoints.length >= 2 && segments.length < waypoints.length - 1 && (
        <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-600 rounded text-xs">
          Need {waypoints.length - 1} segments for {waypoints.length} waypoints
        </div>
      )}

      <div className="w-full text-sm border border-slate-600 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2.5rem_5rem_5rem_1fr_2.5rem] text-gray-400 text-xs bg-slate-800 border-b border-slate-600">
          <div className="py-1 text-center border-r border-slate-600"></div>
          <div className="px-2 py-1 border-r border-slate-600">Lat</div>
          <div className="px-2 py-1 border-r border-slate-600">Lon</div>
          <div className="px-2 py-1 border-r border-slate-600">Segment</div>
          <div className="py-1"></div>
        </div>

        {/* Body */}
        <div className="text-white">
          {waypoints.map((waypoint, index) => (
            <div
              key={`waypoint-${index}-${waypoint[0]}-${waypoint[1]}`}
              className="grid grid-rows-subgrid row-span-2"
            >
              {/* Waypoint Row */}
              <div
                className={clsx(
                  "grid grid-cols-[2.5rem_5rem_5rem_1fr_2.5rem] border-b border-slate-600 bg-slate-900 cursor-pointer hover:bg-slate-800",
                  selectedWaypointIndex === index &&
                    "bg-blue-900/30 hover:bg-blue-900/40",
                )}
                onClick={() => handleWaypointRowClick(index)}
              >
                <div className="py-1 text-center text-blue-400 font-medium border-r border-slate-600 flex items-center justify-center">
                  {index}
                </div>
                <div className="py-1 px-2 border-r border-slate-600">
                  <input
                    type="number"
                    step="0.00001"
                    value={waypoint[0].toFixed(5)}
                    onChange={(e) =>
                      updateWaypoint(
                        index,
                        "lat",
                        Number.parseFloat(e.target.value),
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-1 py-0 bg-transparent text-xs outline-none focus:bg-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="py-1 px-2 border-r border-slate-600">
                  <input
                    type="number"
                    step="0.00001"
                    value={waypoint[1].toFixed(5)}
                    onChange={(e) =>
                      updateWaypoint(
                        index,
                        "lon",
                        Number.parseFloat(e.target.value),
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-1 py-0 bg-transparent text-xs outline-none focus:bg-slate-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="py-1 px-2 border-r border-slate-600">
                  {/* Empty cell for waypoint row */}
                </div>
                <div className="py-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWaypoint(index);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Segment Row (between waypoints) */}
              {index < waypoints.length - 1 && (
                <div
                  className={clsx(
                    "grid grid-cols-[2.5rem_5rem_5rem_1fr_2.5rem] border-b border-slate-600 bg-slate-950",
                    selectedSegmentIndex === index && "bg-green-900/20",
                  )}
                >
                  <div className="py-1 text-center text-green-400 border-r border-slate-600 flex items-center justify-center">
                    ↓
                  </div>
                  <div className="py-1 px-2 border-r border-slate-600">
                    {/* Empty cell for segment row */}
                  </div>
                  <div className="py-1 px-2 border-r border-slate-600">
                    {/* Empty cell for segment row */}
                  </div>
                  <div className="py-1 px-2 border-r border-slate-600">
                    {segments[index] ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {segments[index].type === "straight"
                            ? "Straight"
                            : "Corner"}
                        </span>
                        {segments[index]?.type === "corner" && (
                          <input
                            type="number"
                            step="0.5"
                            value={segments[index].radius}
                            onChange={(e) =>
                              updateSegment(index, {
                                type: "corner",
                                radius: Number.parseFloat(e.target.value),
                              })
                            }
                            className="w-14 px-1 py-0.5 bg-slate-600 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="R"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newSeg = { type: "straight" } as Segment;
                            const updated = [...segments];
                            updated[index] = newSeg;
                            setSegments(updated);
                          }}
                          className="text-xs px-2 py-0.5 bg-blue-600 hover:bg-blue-700 rounded"
                        >
                          + Straight
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newSeg = {
                              type: "corner",
                              radius: cornerRadius,
                            } as Segment;
                            const updated = [...segments];
                            updated[index] = newSeg;
                            setSegments(updated);
                          }}
                          className="text-xs px-2 py-0.5 bg-green-600 hover:bg-green-700 rounded"
                        >
                          + Corner
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="py-1 flex items-center justify-center">
                    {segments[index] && (
                      <button
                        type="button"
                        onClick={() =>
                          updateSegment(
                            index,
                            segments[index].type === "straight"
                              ? { type: "corner", radius: cornerRadius }
                              : { type: "straight" },
                          )
                        }
                        className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                        title={
                          segments[index].type === "straight"
                            ? "Switch to corner"
                            : "Switch to straight"
                        }
                      >
                        <RefreshCcw size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Point Button Row */}
          <div className="border-b border-slate-600 bg-slate-800">
            <button
              type="button"
              onClick={() =>
                setMode(
                  mode.mode === "add-point"
                    ? { mode: "idle" }
                    : { mode: "add-point" },
                )
              }
              className={clsx(
                "w-full px-3 py-2 flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm",
                mode.mode === "add-point"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-700 hover:bg-slate-600",
              )}
            >
              <Plus size={14} />
              Add Point
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={importRoute}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload size={16} />
            Import
          </button>

          <button
            type="button"
            onClick={exportRoute}
            disabled={waypoints.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-gray-500 rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            Export
          </button>

          <button
            type="button"
            onClick={clearRoute}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Status */}
      {waypoints.length >= 2 && segments.length === waypoints.length - 1 && (
        <div className="mt-4 p-2 bg-green-900/30 border border-green-600 rounded text-xs flex items-center gap-2">
          <Check size={14} />
          Route is complete and ready to export
        </div>
      )}
    </div>
  );
};
