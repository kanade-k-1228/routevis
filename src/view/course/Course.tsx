import type { FC } from "react";
import { ListView } from "./ListView";
import { MapView } from "./MapView";

export const Course: FC = () => {
  return (
    <div className="w-full h-full flex">
      <ListView />
      <MapView />
    </div>
  );
};
