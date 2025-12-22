import { useAtomValue } from "jotai";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { Link } from "wouter";
import { getColor, useRouteFileLoader } from "@/state/load";
import { routesAtom } from "@/state/route";
import { MapStyleSelector } from "../common/MapStyleSelector";
import { ListView } from "./List";
import { MapView } from "./Map";

export const RouteView: FC = () => {
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
      className="w-full h-full bg-slate-900 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0">
        <MapView />
      </div>
      <MapStyleSelector />
      <ListView />
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm text-2xl font-bold text-white">
          Drop files here
        </div>
      )}
    </div>
  );
};
