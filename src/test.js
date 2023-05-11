import polylabel from '@mapbox/polylabel';

import { centerOfMass, centroid, center, point, feature, pointOnFeature, lineIntersect, midpoint, bbox, circle, intersect } from '@turf/turf';
import { stringify } from 'uuid';
import { writeFile } from 'fs';

const polygon = 
{
  "type": "Feature",
  "properties": {},
  "geometry": {
    "coordinates": [
      [
        [
          34.49385490032648,
          31.524583200585653
        ],
        [
          34.49385490032648,
          31.524258281975392
        ],
        [
          34.49431879614676,
          31.524258281975392
        ],
        [
          34.49431879614676,
          31.524583200585653
        ],
        [
          34.49385490032648,
          31.524583200585653
        ]
      ]
    ],
    "type": "Polygon"
  }
};

console.time("hi");
let label = point(polylabel(polygon.geometry.coordinates, 0.5));
label.properties['marker-color'] = 'teal';
console.log(JSON.stringify(label) + ',');
label = point(polylabel(polygon.geometry.coordinates, 0.0001));
label.properties['marker-color'] = 'teal';
console.log(JSON.stringify(label) + ',');
label = point(polylabel(polygon.geometry.coordinates, 0.0000001));
label.properties['marker-color'] = 'teal';
console.log(JSON.stringify(label) + ',');

const centre1 = centerOfMass(polygon);
centre1.properties['marker-color'] = 'red';
console.log(JSON.stringify(centre1) + ',');
const centre2 = center(polygon);
centre2.properties['marker-color'] = 'green';
console.log(JSON.stringify(centre2) + ',');
const centre3 = centroid(polygon);
centre3.properties['marker-color'] = 'blue';
console.log(JSON.stringify(centre3) + ',');
const pointFeature = pointOnFeature(polygon);
pointFeature.properties['marker-color'] = 'purple';
console.log(JSON.stringify(pointFeature) + ',');
const bbox2 = bbox(polygon);
const centre = centre2.geometry.coordinates;
const yAxis = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[centre[0], bbox2[3]], [centre[0], bbox2[1]]]
  },
  properties: {
    'stroke': "green",
  }
}

const xAxis = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[bbox2[0], centre[1]], [bbox2[2], centre[1]]]
  },
  properties: {
    'stroke': "red",
  }
}

console.log(JSON.stringify(xAxis) + ',');
console.log(JSON.stringify(yAxis) + ',');

const intersection = lineIntersect(polygon, xAxis);
const intersection2 = lineIntersect(polygon, yAxis);
console.log(JSON.stringify(intersection.features), JSON.stringify(intersection2.features))
// const midpoints = [];
// for (let i = 0; i < intersection.features.length; i += 2) {
//   midpoints.push(midpoint(intersection.features[i], intersection.features[i+1]))
// }
// for (let i = 0; i < intersection2.features.length; i += 2) {
//   midpoints.push(midpoint(intersection2.features[i], intersection2.features[i+1]))
// }
console.log('circle');
let radius = 0.0001;
while (!intersect(polygon, circle(centre, radius))) {
  radius += 0.0001;
}

const radiusCircle = circle(centre, radius);
const closestPoint = centerOfMass(intersect(polygon, radiusCircle));
const slope = [centre[0] - closestPoint.geometry.coordinates[0], centre[1] - closestPoint.geometry.coordinates[1]];
const lineClosest = feature({
  type: 'LineString',
  coordinates: [centre, [centre[0] - slope[0] * 10, centre[1] - slope[1] * 10]],
})
const intersectionBest = lineIntersect(polygon, lineClosest);
const newCentre = midpoint(intersectionBest.features[0], intersectionBest.features[1]);
console.log(polygon, label, centre1, centre2, centre3, radiusCircle, closestPoint);

const featureCollection = {
  type: 'FeatureCollection', 
  features: [polygon, label, centre1, centre2, centre3, radiusCircle, xAxis, yAxis, lineClosest, newCentre]
}

writeFile('collection.json', JSON.stringify(featureCollection), { encoding: 'utf-8'}, () => {})