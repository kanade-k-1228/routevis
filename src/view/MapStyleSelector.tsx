import { useAtom } from "jotai";
import { MapIcon } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { MAPIDS } from "@/map/maps";
import { mapStyleAtom } from "@/state/style";

export const MapStyleSelector: FC = () => {
  const [currentStyle, setCurrentStyle] = useAtom(mapStyleAtom);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute right-4 top-4 z-10">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg bg-slate-800/95 px-4 py-2 text-sm text-white shadow-2xl backdrop-blur-sm transition-colors hover:bg-slate-700"
        >
          <MapIcon className="h-4 w-4" />
          <span>{currentStyle}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800/95 shadow-2xl backdrop-blur-sm">
            <div className="py-1">
              {MAPIDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCurrentStyle(id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm text-white transition-colors hover:bg-slate-700 ${
                    currentStyle === id ? "bg-slate-700" : ""
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
