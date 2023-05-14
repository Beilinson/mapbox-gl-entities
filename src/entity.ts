import type mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import type { Geometry, Feature, FeatureCollection, Point } from 'geojson';
import { SimpleSpecDesign, SimpleSpecLabel, Properties } from './types';
import { GeoJSONSource } from 'mapbox-gl';
import { bbox } from '@turf/turf';
import { BBox2d } from '@turf/helpers/dist/js/lib/geojson';
import { getGeoJsonId, getVisualCenter } from './utils';
import { GeometryConverter } from './geometry-converter';

export type EntityProperties = SimpleSpecDesign & SimpleSpecLabel & Properties;

export class Entity implements Feature<Geometry, EntityProperties> {
  public readonly type: 'Feature' = 'Feature';
  public readonly id: string;
  public properties: EntityProperties;
  public geometry: GeoJSON.Geometry;

  private readonly map: mapboxgl.Map;
  private readonly source: GeoJSONSource;

  constructor(geoJson: Feature<Geometry, EntityProperties> | Geometry, map: mapboxgl.Map, source: string) {
    this.map = map;
    this.source = map.getSource(source) as GeoJSONSource;
    if (geoJson.type === 'Feature') {
      this.id = geoJson.id ?? geoJson.properties?.id ?? v4();
      this.properties = geoJson.properties ?? {};
      this.geometry = geoJson.geometry;
    } else {
      this.geometry = geoJson;
      this.properties = {};
      this.id = v4();
    }
  }

  public get bbox(): BBox2d {
    return bbox(this.geometry) as BBox2d;
  }

  public get centroid(): Point {
    switch (this.geometry.type) {
      case 'Point':
        return this.geometry;
      case 'Polygon':
        return getVisualCenter(this.geometry);
      case 'MultiPoint':
      case 'LineString':
      case 'MultiLineString':
      case 'MultiPolygon':
      case 'GeometryCollection':
        // @ts-ignore
        return centerOfMass(this).geometry;
    }
  }

  public get center(): [number, number] {
    const centroid = this.centroid.coordinates;
    return [centroid[0], centroid[1]];
  }

  public addToMap(): void {
    this.source.add([this]);
  }

  public remove(): void {
    this.source.remove([this.id]);
  }

  public focus(): void {
    if (this.geometry.type === 'Point') {
      this.map.easeTo({ center: this.center });
    } else {
      this.map.fitBounds(this.bbox!);
    }
  }

  public toKml(): string {
    return GeometryConverter.geoJSONToKml(this);
  }

  public toWkt(): string {
    return GeometryConverter.geoJSONToWkt(this);
  }
}
