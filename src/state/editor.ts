import { atom } from "jotai";
import type { RouteData, Segment, Waypoint } from "@/type/geometry";

// ----------------------------------------------------------------------------

export type EditorMode =
  | { mode: "idle" }
  | { mode: "add-point" }
  | { mode: "move-point"; idx: number };

export const editorModeAtom = atom<EditorMode>({ mode: "idle" });

// ----------------------------------------------------------------------------

export const waypointsAtom = atom<Waypoint[]>([]);
export const segmentsAtom = atom<Segment[]>([]);
export const selectedWaypointIndexAtom = atom<number>(-1);
export const selectedSegmentIndexAtom = atom<number>(-1);
export const routeDataAtom = atom<RouteData>((get) => ({
  waypoints: get(waypointsAtom),
  segments: get(segmentsAtom),
}));

// Map view state for centering on waypoints
export const mapCenterAtom = atom<{
  lat: number;
  lng: number;
  zoom?: number;
} | null>(null);
