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

export interface UpdateOBJ {
    key: string,
    val: string;
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

    /*async updateUser(data: object): Promise<boolean>
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
    }*/

    async updateUser(findData: UpdateOBJ, updateData: object)
    {
        const db = await initializeDatabase();
        try {

            const query = await db.user.find({
                selector: this.createUpdateData(findData.key, findData.val)
            })
            await query.update({
                $set: updateData
            })

        } catch(err) {

        }
    }

    private createUpdateData(key: string, val: string): object {
        return {
            [key]: {
                $gt: [val]
            }
        }
    }
}
