import { Injectable } from '@angular/core';
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
    const results = await (await database()).all(query, ...args);
    console.warn('More than one result returned from duckdb query: ', results);
    return results[0];
  }
  static async getMany(query: string, ...args: any[]) {
    return (await database()).all(query, ...args);
  }
}
