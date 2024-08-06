export type Patient = {
    uid: string,
    displayName: string | undefined,
    photoURL: string | undefined,
    email: string,
    emailVerified: boolean,
    token: string,
    isLoggedIn: boolean
}