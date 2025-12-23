import type { FC } from "react";
import { List } from "./List";
import { Map as RouteMap } from "./Map";

export const Editor: FC = () => {
  return (
    <div className="w-full h-full flex">
      <List />
      <RouteMap />
    </div>
  );
};
