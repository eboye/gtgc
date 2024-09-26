import { PageServerLoad } from '@analogjs/router';
import { Datasource } from '../../../../server/datasource';

export const load = async ({ params }: PageServerLoad) => {
  const semanticResults = await Datasource.getMany(`
    SELECT CAST({
        type: 'Feature',
        geometry: ST_AsGeoJSON(geom),
        properties: {
            activityType: activityType,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
        }
    } AS JSON) AS geojson
    FROM semantic_history
    WHERE date_trunc('day', startTimestamp) == ?;
  `, params!.date);
  const locationResults = await Datasource.getMany(`
    SELECT CAST({
        type: 'Feature',
        geometry: ST_AsGeoJSON(geom),
        properties: {
            accuracy: accuracy,
            timestamp: timestamp,
        }
    } AS JSON) AS geojson
    FROM location_records
    WHERE date_trunc('day', timestamp) == ?;
  `, params!.date);
  const semanticData = semanticResults.map((result) => JSON.parse(result.geojson));
  const locationData = locationResults.map((result) => JSON.parse(result.geojson));
  return [...semanticData, ...locationData];

};
