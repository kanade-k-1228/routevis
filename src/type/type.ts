export interface Route {
  log: Log[];
  path: Path[];
  plan: Plan[];
}

export type Log = [number, number, number, number, number]; // [time, distance, latitude, longitude, bearing]
export type Path = [number, number, number, number]; // [distance, latitude, longitude, bearing]
export type Plan = [number, number]; // [time, distance]
