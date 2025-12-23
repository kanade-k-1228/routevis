import { useAtomValue } from "jotai";
import { routeSchema } from "../type/type.zod";
import { routesAtom, useAddRoute } from "./route";

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

export const getColor = (index: number) => COLORS[index % COLORS.length];

export const useDialogLoader = () => {
  const routes = useAtomValue(routesAtom);
  const loadRouteFile = useRouteFileLoader();

  return async () => {
    const fileHandles = await (window as any).showOpenFilePicker({
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
      multiple: true,
    });

    for (let index = 0; index < fileHandles.length; index++) {
      const file = await fileHandles[index].getFile();
      await loadRouteFile(file, getColor(routes.length + index));
    }
  };
};

export const useRouteFileLoader = () => {
  const addRoute = useAddRoute();
  return async (file: File, color = "#3b82f6") => {
    if (!file.name.endsWith(".json")) {
      throw new Error(`${file.name} is not a JSON file`);
    }
    const text = await file.text();
    const raw = JSON.parse(text);
    const data = routeSchema.parse(raw);
    const id = file.name.replace(/\.[^/.]+$/, "");
    addRoute({ id, data, config: { color, visible: true, tangent: false } });
  };
};
