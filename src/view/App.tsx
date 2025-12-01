import { useAtomValue } from "jotai";
import { Upload } from "lucide-react";
import type { FC } from "react";
import { useCallback, useId, useState } from "react";
import { routesAtom, useAddRoute } from "@/state/route";
import type { Route } from "@/type/type";
import { MapStyleSelector } from "./MapStyleSelector";
import { RouteList } from "./RouteList";
import { RouteMap } from "./RouteMap";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];

const generateId = () => crypto.randomUUID();

const generateColor = (index: number) => COLORS[index % COLORS.length];

export const App: FC = () => {
  const routes = useAtomValue(routesAtom);
  const addRoute = useAddRoute();
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputId = useId();

  const handleFiles = useCallback(
    async (files: FileList) => {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (!file.name.endsWith(".json")) {
          setError(`${file.name} is not a JSON file`);
          continue;
        }

        try {
          const text = await file.text();
          const data = JSON.parse(text) as Route;

          // Validate data structure
          if (!data.route || !Array.isArray(data.route)) {
            throw new Error(
              `${file.name}: Invalid format - 'route' array is required`,
            );
          }

          // Generate a new ID for this route
          const newId = generateId();
          const config = {
            color: generateColor(routes.length + index),
            visible: true,
          };

          // Add the route using the hook
          addRoute({ id: newId, data, config });

          setError(null);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : `${file.name}: Failed to parse JSON`,
          );
        }
      }
    },
    [routes.length, addRoute],
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
    event.target.value = ""; // Reset input
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div
      className="h-full w-full bg-slate-900"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {routes.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-lg bg-slate-800 p-8 shadow-xl">
            <h1 className="mb-6 text-2xl font-bold text-white">
              Route Visualizer
            </h1>
            <div className="space-y-4">
              <label
                htmlFor={fileInputId}
                className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-slate-600 bg-slate-700 hover:border-blue-500 hover:bg-slate-600"
                }`}
              >
                <Upload className="mb-3 h-12 w-12 text-slate-400" />
                <span className="mb-2 text-sm text-slate-300">
                  Click or drag & drop JSON files
                </span>
                <span className="text-xs text-slate-400">
                  Format: {"{"}"route": [[time, lat, lng, bearing, velocity],
                  ...]{"}"}
                </span>
                <span className="mt-2 text-xs text-slate-500">
                  Multiple files supported
                </span>
              </label>
              <input
                id={fileInputId}
                type="file"
                accept=".json"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              {error && (
                <div className="rounded border border-red-500 bg-red-900/50 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <RouteMap />
          <MapStyleSelector />
          <RouteList />
          {isDragging && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
              <div className="rounded-lg bg-slate-800 p-8 text-2xl font-bold text-white shadow-2xl">
                Drop files here
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
