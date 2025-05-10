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
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield (0, sqlite_1.open)({
                filename: this.dbPath,
                driver: sqlite3_1.default.Database,
            });
        });
    }
    runQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, params = []) {
            if (!this.db)
                throw new Error('Database not initialized');
            return this.db.run(query, params);
        });
    }
    getQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, params = []) {
            if (!this.db)
                throw new Error('Database not initialized');
            return this.db.get(query, params);
        });
    }
    allQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, params = []) {
            if (!this.db)
                throw new Error('Database not initialized');
            return this.db.all(query, params);
        });
    }
}
exports.DatabaseFacade = DatabaseFacade;
