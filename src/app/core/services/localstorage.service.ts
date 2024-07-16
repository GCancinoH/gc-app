import { Injectable } from "@angular/core";
import { RxSchema, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { AuthSchema } from "../models/auth.schema";

// Suggested code may be subject to a license. Learn more: ~LicenseLog:1909742892.
type DBTypes = 'auth' | 'weight-logger';

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {

}
