import { Injectable } from "@angular/core";
import { initializeDatabase } from "@core/db/auth.db";
import { addRxPlugin } from 'rxdb';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);

/* User LocalDB */
export interface UserDBLocally {
    uid: string;
    email: string | null;
    name: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    token: string;
    isLoggedIn: boolean;
}

@Injectable({
  providedIn: "root"
})
export class LocalDBService {

    async insertIntoUser(data: UserDBLocally) {
        const db = await initializeDatabase();
        try {
            await db.user.insert(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    async findInUser(select: object): Promise<boolean>
    {
        const db = await initializeDatabase();
        try {
            await db.user.findOne({
                selector: {...select }
            })
            return !!true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateUser(data: object): Promise<boolean>
    {
        const db = await initializeDatabase();
        try {
            await db.user.update({
                $set: data
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
