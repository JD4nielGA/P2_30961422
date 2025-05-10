"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsModel = void 0;
const DatabaseFacade_1 = require("../facades/DatabaseFacade");
class ContactsModel {
    constructor() {
        this.db = new DatabaseFacade_1.DatabaseFacade();
        this.initializeDB();
    }
    initializeDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.initialize();
            yield this.db.runQuery(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                name TEXT NOT NULL,
                comment TEXT NOT NULL,
                ip_address TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        });
    }
    add(email, name, comment, ipAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.runQuery(`INSERT INTO contacts (email, name, comment, ip_address) VALUES (?, ?, ?, ?)`, [email, name, comment, ipAddress]);
            return {
                id: result.lastID,
                email,
                name,
                comment,
                ipAddress,
                createdAt: new Date().toISOString(),
            };
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.allQuery('SELECT * FROM contacts ORDER BY created_at DESC');
        });
    }
}
exports.ContactsModel = ContactsModel;
