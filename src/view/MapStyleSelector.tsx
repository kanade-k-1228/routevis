import { Map } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

interface MapStyle {
  id: string;
  name: string;
  path: string;
}

const MAP_STYLES: MapStyle[] = [
  { id: "gsi-ortho", name: "GSI Ortho", path: "@/map/gsi-ortho.json" },
  { id: "gsi-pale", name: "GSI Pale", path: "@/map/gsi-pale.json" },
  { id: "osm-default", name: "OSM Default", path: "@/map/osm-default.json" },
  { id: "osm-dark", name: "OSM Dark", path: "@/map/osm-dark.json" },
];

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (styleId: string) => void;
}

export const MapStyleSelector: FC<MapStyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentStyleName =
    MAP_STYLES.find((s) => s.id === currentStyle)?.name || "Unknown";

  return (
    <div className="absolute right-4 top-4 z-10">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-slate-800/95 px-4 py-2 text-sm text-white shadow-2xl backdrop-blur-sm transition-colors hover:bg-slate-700"
        >
          <Map className="h-4 w-4" />
          <span>{currentStyleName}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800/95 shadow-2xl backdrop-blur-sm">
            <div className="py-1">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    onStyleChange(style.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-slate-700 ${
                    currentStyle === style.id ? "bg-slate-700" : ""
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const getMapStyle = (styleId: string) => {
  const style = MAP_STYLES.find((s) => s.id === styleId);
  if (!style) return MAP_STYLES[0];
  return style;
};
