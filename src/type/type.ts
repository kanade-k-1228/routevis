export interface Route {
  route: Point[];
}

export type Point = [
  number, // time [s]
  number, // latitude [deg]
  number, // longitude [deg]
  number, // bearing [deg]
];
