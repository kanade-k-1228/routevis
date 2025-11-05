import { useAtom } from "jotai";
import { Eye, EyeOff, Trash2, X } from "lucide-react";
import type { FC } from "react";
import { routesAtom } from "@/state/state";

interface RouteListProps {
  onToggle: () => void;
}

export const RouteList: FC<RouteListProps> = ({ onToggle }) => {
  const [routes, setRoutes] = useAtom(routesAtom);

  const handleDelete = (id: string) => {
    setRoutes((prev) => prev.filter((route) => route.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === id ? { ...route, visible: !route.visible } : route,
      ),
    );
  };

  return (
    <div className="absolute left-4 top-4 max-h-[calc(100vh-2rem)] w-80 overflow-hidden rounded-lg bg-slate-800/95 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-slate-700 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Routes</h2>
            <p className="text-xs text-slate-400 mt-1">
              {routes.length} route{routes.length !== 1 ? "s" : ""} loaded
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="flex-shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            title="Hide route list"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
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
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(route.id)}
                  className="flex-shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                  title={route.visible ? "Hide route" : "Show route"}
                >
                  {route.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(route.id)}
                  className="flex-shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
                  title="Delete route"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
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
