import { defineAction } from 'astro:actions';
import { Datasource } from './datasource';
import { z } from 'astro:content';

export const server = {
  queryDistanceByActivityTypeAndYear: defineAction({
    input: z.object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    }),
    handler: async (input: any) => {
      const { startDate, endDate } = input;
      return await Datasource.getMany(`
        SELECT YEAR(endTimestamp) as year, activityType, sum(distance) as distance
        FROM semantic_history
        WHERE endTimestamp BETWEEN ?::DATE AND ?::DATE
        GROUP BY YEAR(endTimestamp), activityType
        ORDER BY YEAR(endTimestamp), activityType;
      `, startDate, endDate);
    }
  })
}
