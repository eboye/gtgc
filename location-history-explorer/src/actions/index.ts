import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { Datasource } from './datasource';

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input: any) => {
      console.log(input);
      return await Datasource.getMany('SELECT * FROM semantic_history LIMIT 5');
    }
  })
}
