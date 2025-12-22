import { useAtomValue } from "jotai";
import type { FC } from "react";
import { useMemo } from "react";
import { originAtom, routeAtom } from "../../state/editor";
import { generateRoute, type Position } from "../../utils/geometry";
import { List } from "./List";
import { Map as RouteMap } from "./Map";

export const Editor: FC = () => {
  const origin = useAtomValue(originAtom);
  const segments = useAtomValue(routeAtom);

  // 始点を Position 形式に変換
  const startPosition = useMemo<Position | null>(() => {
    if (!origin) return null;
    return {
      lat: origin.lat,
      lon: origin.lon,
      heading: origin.bearing,
    };
  }, [origin]);

  // ルートセグメントを生成
  const routeSegments = useMemo(() => {
    if (!startPosition || segments.length === 0) return [];
    return generateRoute(startPosition, segments);
  }, [startPosition, segments]);

  return (
    <div className="w-full h-full flex">
      <List startPosition={startPosition} />
      <RouteMap startPosition={startPosition} routeSegments={routeSegments} />
    </div>
  );
};
