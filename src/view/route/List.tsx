import { useAtom, useAtomValue } from "jotai";
import { Eye, EyeOff, Tangent, Trash2, Upload } from "lucide-react";
import type { FC } from "react";
import { useDialogLoader } from "@/state/load";
import {
  routeConfigFamily,
  routeDataFamily,
  routesAtom,
  useDeleteRoute,
  useFocusRoute,
} from "@/state/route";

export const ListView: FC = () => {
  const routes = useAtomValue(routesAtom);
  const loadRoute = useDialogLoader();
  const focusRoute = useFocusRoute();

  const handleLoadRoute = async () => {
    try {
      await loadRoute();
    } catch (error) {
      console.error("Failed to load route:", error);
    }
  };

  return (
    <div className="absolute left-4 top-4 max-h-[calc(100vh-2rem)] w-80 overflow-hidden rounded-lg bg-slate-800/95 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Routes</h2>
          </div>
          <button
            type="button"
            onClick={handleLoadRoute}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer"
            title="Load route from file"
          >
            <Upload className="h-4 w-4" />
            Load
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
        {routes.map((id) => (
          <RouteItem key={id} id={id} onClick={() => focusRoute(id)} />
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

const RouteItem: FC<{ id: string; onClick?: () => void }> = ({
  id,
  onClick,
}) => {
  const [routeData] = useAtom(routeDataFamily(id));
  const [routeConfig, setRouteConfig] = useAtom(routeConfigFamily(id));
  const deleteRoute = useDeleteRoute();

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRouteConfig((prev) => ({ ...prev, visible: !prev.visible }));
  };

  const handleToggleTangent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRouteConfig((prev) => ({ ...prev, tangent: !prev.tangent }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRoute(id);
  };

  return (
    <div
      key={id}
      onClick={onClick}
      className="border-b border-slate-700/50 p-4 transition-colors hover:bg-slate-700/50 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: routeConfig.color }}
            />
            <h3 className="text-sm font-semibold text-white truncate">{id}</h3>
          </div>
          <p className="text-xs text-slate-400">
            {routeData.route.length} waypoint
            {routeData.route.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handleToggleVisibility}
            className={`shrink-0 rounded p-1.5 transition-colors hover:bg-slate-700 hover:text-white cursor-pointer ${
              routeConfig.visible ? "text-white" : "text-slate-600"
            }`}
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
            onClick={handleToggleTangent}
            className={`shrink-0 rounded p-1.5 transition-colors hover:bg-slate-700 hover:text-white cursor-pointer ${
              routeConfig.tangent ? "text-white" : "text-slate-600"
            }`}
            title={routeConfig.tangent ? "Hide tangent" : "Show tangent"}
          >
            <Tangent className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="shrink-0 rounded p-1.5 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400 cursor-pointer"
            title="Delete route"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
