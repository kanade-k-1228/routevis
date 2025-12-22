import { atom } from "jotai";
import type { PathSegment } from "../utils/geometry";

export type EditorMode =
  | "idle"
  | "setting-start"
  | "setting-heading"
  | "adding-segment";

export const editorStateAtom = atom<EditorMode>("idle");

export const originAtom = atom({
  lat: 35.681236,
  lon: 139.767125,
  bearing: 0.0,
});

export const routeAtom = atom<PathSegment[]>([]);
