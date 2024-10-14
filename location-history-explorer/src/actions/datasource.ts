import { Database } from 'duckdb-async';

let _database: Database | undefined;

async function database(): Promise<Database> {
  if (!_database) {
    _database = await Database.create('../duck.db', {
      access_mode: 'READ_ONLY',
    });
    await _database.exec('INSTALL spatial; LOAD spatial;');
  }
  return _database;
}

export class Datasource {
  static async getOne(query: string, ...args: any[]) {
    const results = await this.getMany(query, ...args);
    if (results.length > 1) {
      console.warn('More than one result returned from duckdb query:', results);
    } else if (results.length === 0) {
      console.warn('No result returned from duckdb query');
    }
    return results[0];
  }
  static async getMany(query: string, ...args: any[]) {
    return (await database()).all(query, ...args);
  }
}
