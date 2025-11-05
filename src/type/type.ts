export type Waypoint = [number, number]; // [latitude, longitude]

export interface RouteData {
  waypoints: Waypoint[];
}

export interface Route {
  id: string;
  name: string;
  color: string;
  waypoints: Waypoint[];
}
