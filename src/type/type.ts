export interface Route {
  route: Point[];
}

export type Point = [number, number, number, number, number, number]; // [time, latitude, longitude, bearing, velocity, yawrate]
