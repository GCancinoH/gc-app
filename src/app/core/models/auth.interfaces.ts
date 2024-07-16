import { User } from "@angular/fire/auth";

export interface AuthResponse {
    success: boolean;
    user?: User | null;
    message?: string;
    error?: string | null;
}
