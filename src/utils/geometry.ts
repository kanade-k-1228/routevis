export interface Position {
  lat: number; // 緯度 [deg]
  lon: number; // 経度 [deg]
  heading: number; // 方位角 [deg] (北を0度として時計回り)
}

// [曲率, 円弧長さ, 緩和曲線長さ]
export type PathSegment = [number, number, number];

export interface RouteSegment {
  curvature: number; // 曲率 [1/m]
  arcLength: number; // 円弧の長さ [m]
  clothoidLength: number; // 緩和曲線の長さ [m]
  arcPoints: Position[]; // 円弧の経路点
  clothoidPoints: Position[]; // 緩和曲線の経路点
}

// 地球上の2点間の距離を計算 (Haversine formula)
export function calculateDistance(p1: Position, p2: Position): number {
  const R = 6371000; // 地球の半径 [m]
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lon - p1.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 位置と方位から指定距離だけ進んだ位置を計算
 */
export function movePosition(
  start: Position,
  distance: number,
  heading: number,
): Position {
  const R = 6371000; // 地球の半径 [m]
  const d = distance / R; // 角距離

  const φ1 = (start.lat * Math.PI) / 180;
  const λ1 = (start.lon * Math.PI) / 180;
  const θ = (heading * Math.PI) / 180;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(d) + Math.cos(φ1) * Math.sin(d) * Math.cos(θ),
  );

  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(d) * Math.cos(φ1),
      Math.cos(d) - Math.sin(φ1) * Math.sin(φ2),
    );

  return {
    lat: (φ2 * 180) / Math.PI,
    lon: (((λ2 * 180) / Math.PI + 540) % 360) - 180, // -180から180に正規化
    heading: heading,
  };
}

/**
 * 円弧セグメントの経路点を生成
 */
export function generateArcPoints(
  start: Position,
  radius: number, // 半径 [m] (正: 右カーブ, 負: 左カーブ)
  arcLength: number, // 弧長 [m]
  pointDensity: number = 1, // 点の密度 [points/m]
): Position[] {
  const points: Position[] = [];
  const numPoints = Math.max(2, Math.ceil(arcLength * pointDensity));
  const curvature = 1 / radius;

  let currentPos = start;
  let currentHeading = start.heading;

  for (let i = 0; i <= numPoints; i++) {
    if (i > 0) {
      const ds = arcLength / numPoints;
      const dθ = (curvature * ds * 180) / Math.PI;
      currentHeading = currentHeading + dθ;

      // 小さな直線セグメントで近似
      currentPos = movePosition(currentPos, ds, currentHeading - dθ / 2);
      currentPos.heading = currentHeading;
    }

    points.push({ ...currentPos });
  }

  return points;
}

/**
 * クロソイド（緩和曲線）セグメントの経路点を生成
 * クロソイド: 曲率が距離に比例して変化する曲線
 */
export function generateClothoidPoints(
  start: Position,
  startCurvature: number, // 開始曲率 [1/m]
  endCurvature: number, // 終了曲率 [1/m]
  length: number, // セグメント長 [m]
  pointDensity: number = 2, // 点の密度 [points/m]
): Position[] {
  const points: Position[] = [];
  const numPoints = Math.max(3, Math.ceil(length * pointDensity));
  const A = (endCurvature - startCurvature) / length; // 曲率の変化率

  let currentPos = start;
  let currentHeading = start.heading;

  for (let i = 0; i <= numPoints; i++) {
    const s = (length * i) / numPoints;

    if (i > 0) {
      const ds = length / numPoints;
      const s_prev = (length * (i - 1)) / numPoints;

      // 区間の平均曲率を使用
      const avgCurvature = startCurvature + (A * (s_prev + s)) / 2;
      const dθ = (avgCurvature * ds * 180) / Math.PI;

      currentHeading = currentHeading + dθ;
      currentPos = movePosition(currentPos, ds, currentHeading - dθ / 2);
      currentPos.heading = currentHeading;
    }

    points.push({ ...currentPos });
  }

  return points;
}

/**
 * 直線セグメントの経路点を生成
 */
export function generateStraightPoints(
  start: Position,
  length: number,
  pointDensity: number = 0.5,
): Position[] {
  const points: Position[] = [];
  const numPoints = Math.max(2, Math.ceil(length * pointDensity));

  for (let i = 0; i <= numPoints; i++) {
    const distance = (length * i) / numPoints;
    const pos = movePosition(start, distance, start.heading);
    pos.heading = start.heading;
    points.push(pos);
  }

  return points;
}

/**
 * 新しい形式で経路を生成
 * segments: [[曲率1, 円弧長1, 緩和曲線長1], [曲率2, 円弧長2, 緩和曲線長2], ...]
 */
export function generateRoute(
  start: Position,
  segments: PathSegment[],
): RouteSegment[] {
  const routeSegments: RouteSegment[] = [];
  let currentPos = start;

  for (let i = 0; i < segments.length; i++) {
    const [curvature, arcLength, clothoidLength] = segments[i];
    const isLastSegment = i === segments.length - 1;

    // 円弧部分を生成
    let arcPoints: Position[] = [];
    if (curvature === 0) {
      // 曲率0の場合は直線
      arcPoints = generateStraightPoints(currentPos, arcLength);
    } else {
      const radius = 1 / Math.abs(curvature);
      arcPoints = generateArcPoints(
        currentPos,
        curvature > 0 ? radius : -radius,
        arcLength,
      );
    }

    // 緩和曲線部分を生成（最後のセグメント以外）
    let clothoidPoints: Position[] = [];
    if (!isLastSegment && clothoidLength > 0) {
      const nextCurvature = segments[i + 1][0];
      const endPos = arcPoints[arcPoints.length - 1];
      clothoidPoints = generateClothoidPoints(
        endPos,
        curvature,
        nextCurvature,
        clothoidLength,
      );
    }

    routeSegments.push({
      curvature,
      arcLength,
      clothoidLength: isLastSegment ? 0 : clothoidLength,
      arcPoints,
      clothoidPoints,
    });

    // 次の開始位置を更新
    if (clothoidPoints.length > 0) {
      currentPos = clothoidPoints[clothoidPoints.length - 1];
    } else {
      currentPos = arcPoints[arcPoints.length - 1];
    }
  }

  return routeSegments;
}

/**
 * RouteSegmentをRoute型（既存フォーマット）に変換
 */
export function convertToRouteFormat(
  segments: RouteSegment[],
  velocity: number = 10, // 速度 [m/s]
): { route: [number, number, number, number][] } {
  const route: [number, number, number, number][] = [];
  let time = 0;

  for (const segment of segments) {
    // 円弧部分の点を追加
    for (let i = 0; i < segment.arcPoints.length; i++) {
      const point = segment.arcPoints[i];

      if (i > 0) {
        const prevPoint = segment.arcPoints[i - 1];
        const distance = calculateDistance(prevPoint, point);
        time += distance / velocity;
      }

      route.push([time, point.lat, point.lon, point.heading]);
    }

    // 緩和曲線部分の点を追加
    for (let i = 0; i < segment.clothoidPoints.length; i++) {
      const point = segment.clothoidPoints[i];

      if (i > 0) {
        const prevPoint =
          i === 0
            ? segment.arcPoints[segment.arcPoints.length - 1]
            : segment.clothoidPoints[i - 1];
        const distance = calculateDistance(prevPoint, point);
        time += distance / velocity;
      }

      route.push([time, point.lat, point.lon, point.heading]);
    }
  }

  return { route };
}

/**
 * 簡易的なJSONフォーマットへの変換
 * 経路データを[[曲率, 円弧長, 緩和曲線長], ...]形式で出力
 */
export function exportSegmentsAsJSON(segments: PathSegment[]): string {
  return JSON.stringify(segments, null, 2);
}
