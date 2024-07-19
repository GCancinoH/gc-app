import { User } from "@angular/fire/auth";

export interface AuthResponse {
    success: boolean;
    user?: User | null;
    message?: string;
    error?: string | null;
}

export interface UserFromLocalDB {
    uid: string,
    displayName: string,
    email: string,
    role: string,
    token: string,
    emailVerified: boolean,
    isLoggedIn: boolean
}
