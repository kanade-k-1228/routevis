import { useAtom } from "jotai";
import { Download, MapPin, Plus, Trash2 } from "lucide-react";
import React, { type FC, useCallback } from "react";
import { editorStateAtom, originAtom, routeAtom } from "../../state/editor";
import type { PathSegment, Position } from "../../utils/geometry";

interface ListProps {
  startPosition: Position | null;
}

export const List: FC<ListProps> = ({ startPosition }) => {
  const [mode, setMode] = useAtom(editorStateAtom);
  const [origin, setOrigin] = useAtom(originAtom);
  const [segments, setSegments] = useAtom(routeAtom);

  const addSegment = useCallback(() => {
    if (!startPosition) {
      alert("Please set the start position first");
      return;
    }
    // Add segment with default values
    const segment: PathSegment = [0, 50, 5]; // [curvature, length, connect]
    setSegments([...segments, segment]);
  }, [startPosition, segments, setSegments]);

  const deleteSegment = useCallback(
    (idx: number) => {
      setSegments(segments.filter((_, i) => i !== idx));
    },
    [segments, setSegments],
  );

  const updateSegment = useCallback(
    (idx: number, field: 0 | 1 | 2, value: number) => {
      const newSegments = [...segments];
      const segment = [...newSegments[idx]] as PathSegment;
      segment[field] = value;
      newSegments[idx] = segment;
      setSegments(newSegments);
    },
    [segments, setSegments],
  );

  const clearRoute = useCallback(() => {
    setOrigin({ lat: 35.681236, lon: 139.767125, bearing: 0 });
    setSegments([]);
    setMode("idle");
  }, [setOrigin, setSegments, setMode]);

  const exportRoute = useCallback(() => {
    if (segments.length === 0) {
      alert("No route to export");
      return;
    }

    const exportData = {
      origin: origin,
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
  }, [origin, segments]);

  return (
    <div className="w-96 bg-slate-900 text-white p-6 overflow-y-auto h-full">
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Origin</h2>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setMode("setting-start")}
            className={`w-full px-4 py-2 rounded flex items-center gap-2 transition-colors cursor-pointer ${
              mode === "setting-start"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <MapPin size={20} />
            Set Start Point
          </button>

          {startPosition && (
            <div className="text-sm text-gray-300 mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-20 text-gray-400">Latitude:</div>
                <input
                  type="number"
                  step="0.000001"
                  value={origin.lat}
                  onChange={(e) =>
                    setOrigin({ ...origin, lat: Number(e.target.value) })
                  }
                  className="flex-1 px-2 py-1 bg-slate-700 rounded text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 text-gray-400">Longitude:</div>
                <input
                  type="number"
                  step="0.000001"
                  value={origin.lon}
                  onChange={(e) =>
                    setOrigin({ ...origin, lon: Number(e.target.value) })
                  }
                  className="flex-1 px-2 py-1 bg-slate-700 rounded text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 text-gray-400">Heading:</div>
                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={origin.bearing}
                    onChange={(e) =>
                      setOrigin({ ...origin, bearing: Number(e.target.value) })
                    }
                    className="flex-1 px-2 py-1 bg-slate-700 rounded text-white text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <table className="w-full border-collapse border border-slate-600">
        <thead>
          <tr className="bg-slate-700">
            <th className="border border-slate-600 px-2 py-1 text-xs text-gray-400 font-normal">
              Length [m]
            </th>
            <th className="border border-slate-600 px-2 py-1 text-xs text-gray-400 font-normal">
              Curvature [1/m]
            </th>
            <th className="border border-slate-600 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment, idx) => (
            <React.Fragment
              key={`segment-${idx}-${segment[0]}-${segment[1]}-${segment[2]}`}
            >
              <tr className="bg-blue-900/20">
                <td className="border border-slate-600 p-1">
                  <input
                    type="number"
                    value={segment[1]}
                    onChange={(e) =>
                      updateSegment(idx, 1, Number(e.target.value))
                    }
                    className="w-full px-1 py-0.5 bg-transparent text-center text-white text-xs outline-none border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="border border-slate-600 p-1">
                  <input
                    type="number"
                    step="0.001"
                    value={segment[0]}
                    onChange={(e) =>
                      updateSegment(idx, 0, Number(e.target.value))
                    }
                    className="w-full px-1 py-0.5 bg-transparent text-center text-white text-xs outline-none border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="border border-slate-600 p-1 text-center">
                  <button
                    type="button"
                    onClick={() => deleteSegment(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>

              {idx < segments.length - 1 && (
                <tr className="bg-green-900/20">
                  <td className="border border-slate-600 p-1">
                    <input
                      type="number"
                      value={segment[2]}
                      onChange={(e) =>
                        updateSegment(idx, 2, Number(e.target.value))
                      }
                      className="w-full px-1 py-0.5 bg-transparent text-center text-white text-xs outline-none border-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  <td className="border border-slate-600 p-1 text-center text-gray-600 text-xs">
                    —
                  </td>
                  <td className="border border-slate-600 p-1"></td>
                </tr>
              )}
            </React.Fragment>
          ))}

          <tr className="border-t-2 border-slate-500">
            <td
              colSpan={3}
              className="border border-slate-600 p-2 text-center bg-slate-700"
            >
              <button
                type="button"
                onClick={addSegment}
                disabled={!startPosition}
                className="w-full py-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:opacity-50 rounded transition-colors flex items-center justify-center cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={exportRoute}
          disabled={segments.length === 0}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-gray-500 rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={20} />
          Export JSON
        </button>

        <button
          type="button"
          onClick={clearRoute}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 size={20} />
          Clear Route
        </button>
      </div>
    </div>
  );
};
