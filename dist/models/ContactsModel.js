"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsModel = void 0;
const DatabaseFacade_1 = require("../facades/DatabaseFacade");
class ContactsModel {
    constructor() {
        this.db = new DatabaseFacade_1.DatabaseFacade();
        this.initializeDB();
    }
    async initializeDB() {
        await this.db.initialize();
        await this.db.runQuery(`
                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    name TEXT NOT NULL,
                    comment TEXT NOT NULL,
                    ip_address TEXT NOT NULL,
                    country TEXT NOT NULL,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);
    }
    async add(email, name, comment, country, ipAddress) {
        const result = await this.db.runQuery(`INSERT INTO contacts (email, name, comment, country, ip_address) VALUES (?, ?, ?, ?, ?)`, [email, name, comment, country, ipAddress]);
        return {
            id: result.lastID,
            email,
            name,
            comment,
            country,
            ipAddress,
            createdAt: new Date().toISOString(),
        };
    }
    async get() {
        return this.db.allQuery('SELECT * FROM contacts ORDER BY created_at DESC');
    }
}
exports.ContactsModel = ContactsModel;
