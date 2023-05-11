# mapbox-gl-entities
A library for working with GeoJSON geometries as ES6 Class entities, with all sorts of helper functions.

## API
Create an entity by passing any valid GeoJSON:

```typescript
import mapboxgl from 'mapbox-gl';
import { Entity } from 'mapbox-gl-entities';

const entity = new Entity(geoJson: GeoJSON.Geometry, map: mapboxgl.Map);
entity.addToMap();
entity.flyTo();
entity.updateDesign(design: simpleSpecDesign);
entity.remove();
entity.
```