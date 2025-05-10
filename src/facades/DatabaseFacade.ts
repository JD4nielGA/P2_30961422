// src/facades/DatabaseFacade.ts
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

export class DatabaseFacade {
    private db: Database | null = null;

    constructor(private dbPath: string = './contacts.db') {}

    public async initialize() {
        this.db = await open({
            filename: this.dbPath,
            driver: sqlite3.Database,
        });
    }

    public async runQuery(query: string, params: any[] = []) {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.run(query, params);
    }

    public async getQuery(query: string, params: any[] = []) {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.get(query, params);
    }

    public async allQuery(query: string, params: any[] = []) {
        if (!this.db) throw new Error('Database not initialized');
        return this.db.all(query, params);
    }

}
