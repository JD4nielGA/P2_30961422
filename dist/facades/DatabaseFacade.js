"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFacade = void 0;
// src/facades/DatabaseFacade.ts
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
class DatabaseFacade {
    constructor(dbPath = './contacts.db') {
        this.dbPath = dbPath;
        this.db = null;
    }
    async initialize() {
        this.db = await (0, sqlite_1.open)({
            filename: this.dbPath,
            driver: sqlite3_1.default.Database,
        });
    }
    async runQuery(query, params = []) {
        if (!this.db)
            throw new Error('Database not initialized');
        return this.db.run(query, params);
    }
    async getQuery(query, params = []) {
        if (!this.db)
            throw new Error('Database not initialized');
        return this.db.get(query, params);
    }
    async allQuery(query, params = []) {
        if (!this.db)
            throw new Error('Database not initialized');
        return this.db.all(query, params);
    }
}
exports.DatabaseFacade = DatabaseFacade;
