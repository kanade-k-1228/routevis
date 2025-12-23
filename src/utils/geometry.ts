import type { Segment, Waypoint } from "@/type/geometry";

export interface ResolvedSegment {
  start: Waypoint;
  end: Waypoint;
  startBearing: number;
  endBearing: number;
  length: number;
  // Additional properties for corner segments
  arcStart?: Waypoint;
  arcEnd?: Waypoint;
  arcCenter?: Waypoint;
  arcSweep?: number;
  straight1Length?: number;
  arcLength?: number;
  straight2Length?: number;
}

// Convert degrees to radians
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// Convert radians to degrees
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

// Haversine distance in meters
const haversineDistance = (p1: Waypoint, p2: Waypoint): number => {
  const R = 6371000; // Earth's radius in meters
  const lat1 = toRadians(p1[0]);
  const lat2 = toRadians(p2[0]);
  const dLat = toRadians(p2[0] - p1[0]);
  const dLon = toRadians(p2[1] - p1[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate bearing from p1 to p2
const calculateBearing = (p1: Waypoint, p2: Waypoint): number => {
  const lat1 = toRadians(p1[0]);
  const lat2 = toRadians(p2[0]);
  const dLon = toRadians(p2[1] - p1[1]);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return Math.atan2(y, x);
};

// Convert lat/lon to local x/y coordinates (meters from reference point)
const toLocalCoords = (
  point: Waypoint,
  reference: Waypoint,
): [number, number] => {
  const R = 6371000; // Earth's radius in meters
  const latRad = toRadians(reference[0]);

  const x = toRadians(point[1] - reference[1]) * R * Math.cos(latRad);
  const y = toRadians(point[0] - reference[0]) * R;

  return [x, y];
};

// Convert local x/y coordinates back to lat/lon
const fromLocalCoords = (
  x: number,
  y: number,
  reference: Waypoint,
): Waypoint => {
  const R = 6371000; // Earth's radius in meters
  const latRad = toRadians(reference[0]);

  const lat = reference[0] + toDegrees(y / R);
  const lon = reference[1] + toDegrees(x / (R * Math.cos(latRad)));

  return [lat, lon];
};

// Normalize a vector
const normalize = (dx: number, dy: number): [number, number] => {
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 1e-10) return [0, 0];
  return [dx / length, dy / length];
};

// Find intersection of two lines
const lineIntersection = (
  p1: [number, number],
  d1: [number, number],
  p2: [number, number],
  d2: [number, number],
): [number, number] | null => {
  const det = d1[0] * d2[1] - d1[1] * d2[0];
  if (Math.abs(det) < 1e-10) return null;

  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const t = (dx * d2[1] - dy * d2[0]) / det;

  return [p1[0] + t * d1[0], p1[1] + t * d1[1]];
};

// Resolve a straight segment
export const resolveStraight = (
  waypoints: Waypoint[],
  idx: number,
): ResolvedSegment => {
  const n = waypoints.length;
  const start = waypoints[idx % n];
  const end = waypoints[(idx + 1) % n];

  const length = haversineDistance(start, end);
  const bearing = calculateBearing(start, end);

  return {
    start,
    end,
    startBearing: bearing,
    endBearing: bearing,
    length,
  };
};

// Resolve a corner segment
export const resolveCorner = (
  waypoints: Waypoint[],
  idx: number,
  radius: number,
): ResolvedSegment => {
  const n = waypoints.length;

  if (n < 4) {
    // Not enough waypoints for a corner, fall back to straight
    return resolveStraight(waypoints, idx);
  }

  const wpPrev = waypoints[(idx - 1 + n) % n];
  const wp0 = waypoints[idx % n];
  const wp1 = waypoints[(idx + 1) % n];
  const wpNext = waypoints[(idx + 2) % n];

  // Convert to local coordinates using wp0 as reference
  const prevLocal = toLocalCoords(wpPrev, wp0);
  const p0Local: [number, number] = [0, 0];
  const p1Local = toLocalCoords(wp1, wp0);
  const nextLocal = toLocalCoords(wpNext, wp0);

  // Direction vectors in local coordinates
  const dIn = normalize(p0Local[0] - prevLocal[0], p0Local[1] - prevLocal[1]);
  const dOut = normalize(nextLocal[0] - p1Local[0], nextLocal[1] - p1Local[1]);

  const bearingIn = Math.atan2(dIn[0], dIn[1]);
  const bearingOut = Math.atan2(dOut[0], dOut[1]);

  // Calculate turn angle
  let angle = bearingOut - bearingIn;
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;

  // If angle is too small, treat as straight
  if (Math.abs(angle) < 0.001) {
    return resolveStraight(waypoints, idx);
  }

  const dOutRev: [number, number] = [-dOut[0], -dOut[1]];

  // Find vertex (intersection point) in local coordinates
  const vertex = lineIntersection(p0Local, dIn, p1Local, dOutRev);

  if (!vertex) {
    return resolveStraight(waypoints, idx);
  }

  const direction = angle >= 0 ? 1 : -1;

  // Calculate center point in local coordinates
  const dirVToP0 = normalize(p0Local[0] - vertex[0], p0Local[1] - vertex[1]);
  const dirVToP1 = normalize(p1Local[0] - vertex[0], p1Local[1] - vertex[1]);

  let bisector = normalize(
    dirVToP0[0] + dirVToP1[0],
    dirVToP0[1] + dirVToP1[1],
  );

  if (bisector[0] === 0 && bisector[1] === 0) {
    bisector =
      direction > 0 ? [dirVToP0[1], -dirVToP0[0]] : [-dirVToP0[1], dirVToP0[0]];
  }

  const dot = dirVToP0[0] * dirVToP1[0] + dirVToP0[1] * dirVToP1[1];
  const actualHalfAngle = Math.acos(Math.max(-1, Math.min(1, dot))) / 2;
  const centerDist =
    actualHalfAngle > 0.001 ? radius / Math.sin(actualHalfAngle) : 0;

  const centerLocal: [number, number] = [
    vertex[0] + centerDist * bisector[0],
    vertex[1] + centerDist * bisector[1],
  ];

  // Calculate tangent points in local coordinates
  const t1Param =
    (centerLocal[0] - p0Local[0]) * dIn[0] +
    (centerLocal[1] - p0Local[1]) * dIn[1];
  const t1Local: [number, number] = [
    p0Local[0] + t1Param * dIn[0],
    p0Local[1] + t1Param * dIn[1],
  ];

  const t2Param =
    (centerLocal[0] - p1Local[0]) * dOutRev[0] +
    (centerLocal[1] - p1Local[1]) * dOutRev[1];
  const t2Local: [number, number] = [
    p1Local[0] + t2Param * dOutRev[0],
    p1Local[1] + t2Param * dOutRev[1],
  ];

  // Convert back to lat/lon coordinates
  const t1 = fromLocalCoords(t1Local[0], t1Local[1], wp0);
  const t2 = fromLocalCoords(t2Local[0], t2Local[1], wp0);
  const center = fromLocalCoords(centerLocal[0], centerLocal[1], wp0);

  // Calculate arc sweep
  const arcAngleT1 = Math.atan2(
    t1Local[0] - centerLocal[0],
    t1Local[1] - centerLocal[1],
  );
  const arcAngleT2 = Math.atan2(
    t2Local[0] - centerLocal[0],
    t2Local[1] - centerLocal[1],
  );

  let arcSweep = arcAngleT2 - arcAngleT1;
  while (arcSweep > Math.PI) arcSweep -= 2 * Math.PI;
  while (arcSweep < -Math.PI) arcSweep += 2 * Math.PI;

  // Calculate segment lengths
  const straight1Length = Math.sqrt(
    t1Local[0] * t1Local[0] + t1Local[1] * t1Local[1],
  );
  const arcLength = Math.abs(arcSweep) * radius;
  const straight2Length = Math.sqrt(
    (p1Local[0] - t2Local[0]) ** 2 + (p1Local[1] - t2Local[1]) ** 2,
  );
  const totalLength = straight1Length + arcLength + straight2Length;

  return {
    start: wp0,
    end: wp1,
    startBearing: bearingIn,
    endBearing: bearingOut,
    length: totalLength,
    arcStart: t1,
    arcEnd: t2,
    arcCenter: center,
    arcSweep,
    straight1Length,
    arcLength,
    straight2Length,
  };
};

// Get position along a resolved segment at distance s
export const getPositionOnSegment = (
  resolved: ResolvedSegment,
  segment: Segment,
  s: number,
): { position: Waypoint; bearing: number } => {
  s = Math.max(0, Math.min(s, resolved.length));

  if (segment.type === "straight") {
    // Straight segment
    if (resolved.length <= 0) {
      return { position: resolved.start, bearing: resolved.startBearing };
    }

    const t = s / resolved.length;
    const lat = resolved.start[0] + t * (resolved.end[0] - resolved.start[0]);
    const lon = resolved.start[1] + t * (resolved.end[1] - resolved.start[1]);

    return { position: [lat, lon], bearing: resolved.startBearing };
  } else {
    // Corner segment
    const straight1Length = resolved.straight1Length || 0;
    const arcLength = resolved.arcLength || 0;
    const straight2Length = resolved.straight2Length || 0;

    // Convert to local coordinates for calculations
    const startLocal: [number, number] = [0, 0];
    const arcStartLocal = resolved.arcStart
      ? toLocalCoords(resolved.arcStart, resolved.start)
      : startLocal;
    const arcEndLocal = resolved.arcEnd
      ? toLocalCoords(resolved.arcEnd, resolved.start)
      : startLocal;
    const arcCenterLocal = resolved.arcCenter
      ? toLocalCoords(resolved.arcCenter, resolved.start)
      : startLocal;
    const endLocal = toLocalCoords(resolved.end, resolved.start);

    // First straight section
    if (s <= straight1Length) {
      const t = straight1Length > 0 ? s / straight1Length : 0;
      const x = startLocal[0] + t * (arcStartLocal[0] - startLocal[0]);
      const y = startLocal[1] + t * (arcStartLocal[1] - startLocal[1]);
      const pos = fromLocalCoords(x, y, resolved.start);
      return { position: pos, bearing: resolved.startBearing };
    }

    // Arc section
    const sArc = s - straight1Length;
    if (
      sArc <= arcLength &&
      resolved.arcCenter &&
      resolved.arcStart &&
      resolved.arcSweep !== undefined
    ) {
      if (arcLength <= 0) {
        return { position: resolved.arcStart, bearing: resolved.startBearing };
      }

      const startAngle = Math.atan2(
        arcStartLocal[0] - arcCenterLocal[0],
        arcStartLocal[1] - arcCenterLocal[1],
      );

      const arcProgress = sArc / arcLength;
      const currentAngle = startAngle + resolved.arcSweep * arcProgress;
      const radius = segment.radius;

      const x = arcCenterLocal[0] + radius * Math.sin(currentAngle);
      const y = arcCenterLocal[1] + radius * Math.cos(currentAngle);

      const pos = fromLocalCoords(x, y, resolved.start);
      const direction = resolved.arcSweep >= 0 ? 1 : -1;
      const bearing = currentAngle + (direction * Math.PI) / 2;

      return { position: pos, bearing };
    }

    // Second straight section
    const sStraight2 = s - straight1Length - arcLength;
    const t =
      straight2Length > 0 ? Math.min(1, sStraight2 / straight2Length) : 1;
    const x = arcEndLocal[0] + t * (endLocal[0] - arcEndLocal[0]);
    const y = arcEndLocal[1] + t * (endLocal[1] - arcEndLocal[1]);
    const pos = fromLocalCoords(x, y, resolved.start);

    return { position: pos, bearing: resolved.endBearing };
  }
};

// Generate path points for rendering
export const generateSegmentPath = (
  resolved: ResolvedSegment,
  segment: Segment,
  numPoints: number = 50,
): Waypoint[] => {
  const points: Waypoint[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const s = (i / numPoints) * resolved.length;
    const { position } = getPositionOnSegment(resolved, segment, s);
    points.push(position);
  }

  return points;
};
