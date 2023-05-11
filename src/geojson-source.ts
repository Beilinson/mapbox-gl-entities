import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { getGeoJsonId } from './utils';
import { feature } from '@turf/turf';

declare module 'mapbox-gl' {
  export interface GeoJSONSource {
    _data: string | GeoJSON.FeatureCollection;
    promoteId: string;
    add(geo: GeoJSON.Feature[]): Promise<void>;
    remove(ids: (number | string)[]): Promise<void>;
  }
}

mapboxgl.GeoJSONSource.prototype.add = GeoJSONSource.prototype.add = async function add(geo: GeoJSON.Feature[]): Promise<void> {
  // TODO: This is done because we can't change the worker directly
  if (typeof this._data === 'string') {
    this._data = (await (await fetch(this._data)).json()) as GeoJSON.FeatureCollection;
  }
  geo.forEach((geo) => {
    const id = getGeoJsonId(geo, this.promoteId);
    let original = (this._data as GeoJSON.FeatureCollection).features.find((original) => getGeoJsonId(original, this.promoteId) === id);
    if (original) {
      original.geometry = geo.geometry;
      original.properties = geo.properties;
    } else {
      (this._data as GeoJSON.FeatureCollection).features.push(geo);
    }
  });
  this.setData(this._data);
};

mapboxgl.GeoJSONSource.prototype.remove = GeoJSONSource.prototype.remove = async function remove(ids: (number | string)[]): Promise<void> {
  // TODO: This is done because we can't change the worker directly
  if (typeof this._data === 'string') {
    this._data = (await (await fetch(this._data)).json()) as GeoJSON.FeatureCollection;
  }
  this.setData({
    type: 'FeatureCollection',
    features: (this._data as GeoJSON.FeatureCollection).features.filter(
      (original) => !ids.includes(getGeoJsonId(original, this.promoteId))
    ),
  });
};
