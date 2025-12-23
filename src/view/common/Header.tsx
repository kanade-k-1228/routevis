import clsx from "clsx";
import { CarIcon } from "lucide-react";
import type { FC } from "react";
import { Link, useLocation } from "wouter";

export const Header: FC = () => {
  const [location] = useLocation();

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <CarIcon className="text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-white">
              {"ADAS Integration Toolkit"}
            </h1>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/routes/"
              className={clsx(
                "px-4 py-1.5 rounded transition-colors cursor-pointer text-sm",
                location === "/routes/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700",
              )}
            >
              Routes
            </Link>
            <Link
              href="/course/"
              className={clsx(
                "px-4 py-1.5 rounded transition-colors cursor-pointer text-sm",
                location === "/course/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700",
              )}
            >
              Course
            </Link>
            <Link
              href="/plan/"
              className={clsx(
                "px-4 py-1.5 rounded transition-colors cursor-pointer text-sm",
                location === "/plan/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-700",
              )}
            >
              Plan
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
