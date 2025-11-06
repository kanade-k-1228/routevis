import { useAtom, useAtomValue } from "jotai";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import type { FC } from "react";
import {
  routesAtom,
  routeDataFamily,
  routeConfigFamily,
  useDeleteRoute,
} from "@/state/state";

export const RouteList: FC = () => {
  const routes = useAtomValue(routesAtom);
  return (
    <div className="absolute left-4 top-4 max-h-[calc(100vh-2rem)] w-80 overflow-hidden rounded-lg bg-slate-800/95 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-slate-700 p-4">
        <div>
          <h2 className="text-lg font-bold text-white">Routes</h2>
          <p className="text-xs text-slate-400 mt-1">
            {routes.length} route{routes.length !== 1 ? "s" : ""} loaded
          </p>
        </div>
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
        {routes.map((id) => (
          <RouteItem key={id} id={id} />
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

const RouteItem: FC<{ id: string }> = ({ id }) => {
  const [routeData] = useAtom(routeDataFamily(id));
  const [routeConfig, setRouteConfig] = useAtom(routeConfigFamily(id));
  const deleteRoute = useDeleteRoute();

  const handleToggleVisibility = () => {
    setRouteConfig((prev) => ({ ...prev, visible: !prev.visible }));
  };

  return (
    <div
      key={id}
      className="border-b border-slate-700/50 p-4 transition-colors hover:bg-slate-700/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: routeConfig.color }}
            />
            <h3 className="text-sm font-semibold text-white truncate">
              Route {id.slice(0, 8)}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {routeData.log.length} waypoint
            {routeData.log.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="flex-shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            title={routeConfig.visible ? "Hide route" : "Show route"}
          >
            {routeConfig.visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => deleteRoute(id)}
            className="flex-shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
            title="Delete route"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
