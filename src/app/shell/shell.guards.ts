import { redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

export const redirectUnauthorizedUsersTo = redirectUnauthorizedTo('/auth/authenticate');
export const redirectAuthorizedUsersTo = redirectLoggedInTo('/u/dashboard');