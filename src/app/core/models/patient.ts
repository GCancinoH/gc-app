export interface Patient {
    uid: string;
    displayName: string | undefined;
    email: string;
    photoURL: string | undefined;
    emailVerified: boolean;
    phoneNumber: string;
}