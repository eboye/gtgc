import { Database } from "duckdb-async";

const database = await Database.create("../duck.db", { 'access_mode': 'READ_ONLY' });
await database.exec('INSTALL spatial; LOAD spatial;');

export const duckdb = {
  getOne: async (query: string, ...args: any[]) => {
    const results = await database.all(query, ...args);
    console.warn('More than one result returned from duckdb query: ', results);
    return results[0];
  },
  getMany: async (query: string, ...args: any[]) => {
    return await database.all(query, ...args);
  }
};
