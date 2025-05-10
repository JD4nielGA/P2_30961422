import { DatabaseFacade } from '../facades/DatabaseFacade';

export class ContactsModel {
    private db: DatabaseFacade;

    constructor() {
        this.db = new DatabaseFacade();
        this.initializeDB();
    }

    private async initializeDB() {
        await this.db.initialize();
        await this.db.runQuery(`
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                name TEXT NOT NULL,
                comment TEXT NOT NULL,
                ip_address TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async add(email: string, name: string, comment: string, ipAddress: string) {
        const result = await this.db.runQuery(
            `INSERT INTO contacts (email, name, comment, ip_address) VALUES (?, ?, ?, ?)`,
            [email, name, comment, ipAddress]
        );

        return {
            id: result.lastID,
            email,
            name,
            comment,
            ipAddress,
            createdAt: new Date().toISOString(),
        };
    }

    public async get() {
        return this.db.allQuery('SELECT * FROM contacts ORDER BY created_at DESC');
    }
}
