import { useAtom } from "jotai";
import type { FC } from "react";
import { routesAtom } from "@/state/state";

export const RouteList: FC = () => {
  const [routes, setRoutes] = useAtom(routesAtom);

  const handleDelete = (id: string) => {
    setRoutes((prev) => prev.filter((route) => route.id !== id));
  };

  return (
    <div className="absolute left-4 top-4 max-h-[calc(100vh-2rem)] w-80 overflow-hidden rounded-lg bg-slate-800/95 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-slate-700 p-4">
        <h2 className="text-lg font-bold text-white">Routes</h2>
        <p className="text-xs text-slate-400 mt-1">
          {routes.length} route{routes.length !== 1 ? "s" : ""} loaded
        </p>
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
        {routes.map((route) => (
          <div
            key={route.id}
            className="border-b border-slate-700/50 p-4 transition-colors hover:bg-slate-700/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: route.color }}
                  />
                  <h3 className="text-sm font-semibold text-white truncate">
                    {route.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  {route.waypoints.length} waypoint
                  {route.waypoints.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(route.id)}
                className="flex-shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
                title="Delete route"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Delete icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {routes.length === 0 && (
        <div className="p-8 text-center text-slate-400">
          <p className="text-sm">No routes loaded</p>
        </div>
      )}
    </div>
  );
};
