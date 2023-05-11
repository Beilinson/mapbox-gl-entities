import {
  Feature,
  Geometry,
  Point,
  Polygon,
  booleanPointInPolygon,
  centerOfMass,
  circle,
  feature,
  intersect,
  lineIntersect,
  lineString,
  midpoint,
} from '@turf/turf';

export const filterObject = <TAllowed extends readonly any[], T extends Record<string, any>, TReturn extends T>(
  allowed: TAllowed,
  raw: T
): TReturn => {
  return (Object.keys(raw) as readonly (keyof T)[])
    .filter((key) => allowed.includes(key) && raw[key] !== undefined)
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {} as T) as TReturn;
};

export const isObjectEmpty = (obj: any): boolean => Object.keys(obj).length === 0;

export const getVisualCenter = (polygon: Polygon | Feature<Polygon>): Point => {
  const centroid = centerOfMass(polygon);
  if (booleanPointInPolygon(centroid, polygon)) return centroid.geometry;
  let radius = 0.0001;
  while (!intersect(polygon, circle(centroid, radius))) {
    radius += 0.0001;
  }

  const circleIntersection = circle(centroid, radius);
  const closestPointOnPolygon = centerOfMass(intersect(polygon, circleIntersection));
  const slope = lineString([
    centroid.geometry.coordinates,
    [
      centroid.geometry.coordinates[0] - (centroid.geometry.coordinates[0] - closestPointOnPolygon.geometry.coordinates[0]) * 10,
      centroid.geometry.coordinates[1] - (centroid.geometry.coordinates[1] - closestPointOnPolygon.geometry.coordinates[1]) * 10,
    ],
  ]);
  const intersection = lineIntersect(polygon, slope);
  return midpoint(intersection.features[0], intersection.features[1]).geometry;
};

export const getGeoJsonId = (geo: GeoJSON.Feature, promoteId?: string): number | string =>
  promoteId ? geo.properties![promoteId] : geo.id;
