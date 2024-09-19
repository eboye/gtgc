import { Database } from "duckdb-async";

const database = await Database.create("../duck.db", { 'access_mode': 'READ_ONLY' });

export const duckdb = {
  getOne: async (query: string) => {
    const results = await database.all(query);
    console.warn('More than one result returned from duckdb query: ', results);
    return results[0];
  },
  getMany: async (query: string) => {
    return await database.all(query);
  }
};
