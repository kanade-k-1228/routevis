import { useAtomValue } from "jotai";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { getColor, useRouteFileLoader } from "@/state/load";
import { routesAtom } from "@/state/route";
import { MapStyleSelector } from "./MapStyleSelector";
import { RouteList } from "./RouteList";
import { RouteMap } from "./RouteMap";

export const App: FC = () => {
  const routes = useAtomValue(routesAtom);
  const loadFile = useRouteFileLoader();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList) => {
      for (let i = 0; i < files.length; i++) {
        await loadFile(files[i], getColor(routes.length + i));
      }
    },
    [loadFile, routes.length],
  );

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
      <RouteMap />
      <MapStyleSelector />
      <RouteList />
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm text-2xl font-bold text-white">
          Drop files here
        </div>
      )}
    </div>
  );
};
