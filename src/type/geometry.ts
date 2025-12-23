export type Waypoint = [number, number]; // lat, lon

export type Segment = Straight | Corner;
export interface Straight {
  type: "straight";
}
export interface Corner {
  type: "corner";
  radius: number;
}

export interface RouteData {
  waypoints: Waypoint[];
  segments: Segment[];
}
