import { AuthSchema } from '@core/models/auth.schema';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie} from 'rxdb/plugins/storage-dexie';

let authDBInstance: any = null;

export async function initializeDatabase() {
    if (!authDBInstance) {
        authDBInstance = await createAuthDB();
    }

    return authDBInstance;
}

export async function createAuthDB() {
    const db = await createRxDatabase({
        name: 'gcDB',
        storage: getRxStorageDexie(),
        password: "Tuki.Flow#0120",
        multiInstance: true
    });

    await db.addCollections({
        user: {
            schema: AuthSchema
        }
    });

    return db;
}