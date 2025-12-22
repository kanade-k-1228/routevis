import type { FC } from "react";
import { Link, useLocation } from "wouter";
import { Map as MapIcon, Edit3, Home } from "lucide-react";

export const Header: FC = () => {
  const [location] = useLocation();

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="container px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <MapIcon className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-white">Route Visualizer</h1>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                location === "/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700"
              }`}
            >
              <Home size={16} />
              <span className="text-sm">Visualizer</span>
            </Link>
            <Link
              href="/edit/"
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                location === "/edit/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700"
              }`}
            >
              <Edit3 size={16} />
              <span className="text-sm">Editor</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
