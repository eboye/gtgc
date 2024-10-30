import { defineAction } from 'astro:actions';
import { Datasource } from './datasource';
import { z } from 'astro:content';
import type { Feature } from 'geojson';

export const server = {
  minAndMaxDates: defineAction({
    handler: async () => {
      return await Datasource.getOne(`
        SELECT MAX(timestamp) as max, MIN(timestamp) as min
        FROM location_records
      `) as { max: Date, min: Date };
    }
  }),
  queryDistanceByActivityTypeAndYear: defineAction({
    input: z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    }),
    handler: async (input: any) => {
      const { startDate, endDate } = input;
      return await Datasource.getMany(`
        SELECT YEAR(startTimestamp) as year, activityType, sum(distance) as sum
        FROM semantic_history
        WHERE startTimestamp BETWEEN ?::DATE AND ?::DATE
        GROUP BY YEAR(startTimestamp), activityType
        ORDER BY YEAR(startTimestamp), activityType;
      `, startDate, endDate);
    }
  }),
  queryDurationByActivityTypeAndYear: defineAction({
    input: z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    }),
    handler: async (input: any) => {
      const { startDate, endDate } = input;
      return await Datasource.getMany(`
        SELECT YEAR(startTimestamp) as year, activityType, sum(extract('minute' FROM endTimestamp - startTimestamp)) as sum
        FROM semantic_history
        WHERE startTimestamp BETWEEN ?::DATE AND ?::DATE
        GROUP BY YEAR(startTimestamp), activityType
        ORDER BY YEAR(startTimestamp), activityType;
      `, startDate, endDate);
    }
  }),
  queryLocationRecords: defineAction({
    input: z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    }),
    handler: async (input: any) => {
      const { startDate, endDate } = input;
      const records = await Datasource.getMany(`
        SELECT CAST({
            type: 'Feature',
            geometry: ST_AsGeoJSON(geom),
            properties: {
                accuracy: accuracy,
                timestamp: timestamp,
            }
        } AS JSON) AS geojson
        FROM location_records
        WHERE timestamp BETWEEN ?::DATE AND ?::DATE
        LIMIT 10000;
      `, startDate, endDate);
      return records.map((record) => JSON.parse(record.geojson));
    }
  }),
  querySemanticHisotry: defineAction({
    input: z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    }),
    handler: async (input: any) => {
      const { startDate, endDate } = input;
      const records = await Datasource.getMany(`
        SELECT
          CAST({
            type: 'Feature',
            geometry: ST_AsGeoJSON(ST_MakeLine(l.points)),
            properties: {
              activityType: s.activityType,
              startTimestamp: s.startTimestamp,
              endTimestamp: s.endTimestamp,
            }
          } AS JSON) as geojson
        FROM
          semantic_history as s,
          (
            SELECT
              LIST(geom) as points
            FROM
              location_records
            WHERE
              "timestamp" BETWEEN s.startTimestamp AND s.endTimestamp
              AND geom IS NOT NULL
          ) as l
        WHERE
          s.startTimestamp BETWEEN ?::DATE AND ?::DATE
          AND len(l.points) >= 2
        LIMIT 1000;
      `, startDate, endDate);

      return records.map((record) => JSON.parse(record.geojson)) as Feature[];
    }
  }),
}
