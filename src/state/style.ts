import { atomWithStorage } from "jotai/utils";

export const mapStyleAtom = atomWithStorage<string>("map-style", "osm-dark");
