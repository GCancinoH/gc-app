import { createAuthDB } from "./db/auth.db";

let authDBInstance: any = null;

export async function initializeAuthDB() {
    if(!authDBInstance) {
        authDBInstance = await createAuthDB();
    }
    return authDBInstance;
}

export async function appInitialization() {
    if(!localStorage.getItem('firstTimeAccessed')) {
        localStorage.setItem('firstTimeAccessed', 'true');

        createAuthDB().then(db => {
            console.log("Database created successfully");
            console.log("Database: ", db);
        }).catch(error => {
            console.error("Error creating database:", error);
        });
    }
}