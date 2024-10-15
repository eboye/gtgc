import { defineAction } from 'astro:actions';
import { Datasource } from './datasource';
import { z } from 'astro:content';

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
        SELECT YEAR(endTimestamp) as year, activityType, sum(distance) as sum
        FROM semantic_history
        WHERE endTimestamp BETWEEN ?::DATE AND ?::DATE
        GROUP BY YEAR(endTimestamp), activityType
        ORDER BY YEAR(endTimestamp), activityType;
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
        SELECT YEAR(endTimestamp) as year, activityType, sum(extract('minute' FROM endTimestamp - startTimestamp)) as sum
        FROM semantic_history
        WHERE endTimestamp BETWEEN ?::DATE AND ?::DATE
        GROUP BY YEAR(endTimestamp), activityType
        ORDER BY YEAR(endTimestamp), activityType;
      `, startDate, endDate);
    }
  })
}
