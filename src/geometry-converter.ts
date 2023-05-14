import { geoJSONToWkt as geoToWkt, wktToGeoJSON as wktToGeo } from 'betterknown';
import { toKML } from '@placemarkio/tokml';
import { kml as kmlToGeo } from '@tmcw/togeojson';
import { feature, featureCollection } from '@turf/turf';
import type { GeoJSON, Geometry, FeatureCollection } from 'geojson';

export namespace GeometryConverter {
  const DOM_PARSER = new DOMParser();
  export function geoJSONToWkt(geoJSON: GeoJSON): string {
    switch (geoJSON.type) {
      case 'Feature':
        return geoToWkt(geoJSON.geometry);
      case 'FeatureCollection':
        return geoToWkt({
          type: 'GeometryCollection',
          geometries: geoJSON.features.map((feature) => feature.geometry),
        });
      default:
        return geoToWkt(geoJSON as Geometry);
    }
  }

  export function geoJSONToKml(geoJSON: GeoJSON): string {
    let collection: FeatureCollection;
    if (geoJSON.type !== 'FeatureCollection') {
      if (geoJSON.type === 'Feature') collection = featureCollection([geoJSON]);
      else collection = featureCollection([feature(geoJSON)]);
    } else {
      collection = geoJSON;
    }

    return toKML(collection);
  }

  export function wktToGeoJSON(wkt: string): Geometry {
    const geo = wktToGeo(wkt);
    if (!geo) throw new Error(`Could not parse wkt: ${wkt}`);
    return geo;
  }

  export function kmlToGeoJSON(kml: string): FeatureCollection<Geometry | null> {
    const geo = kmlToGeo(DOM_PARSER.parseFromString(kml, 'application/xml'));
    if (!geo) throw new Error(`Could not parse kml: ${kml}`);
    return geo;
  }
}
