import { PatientInitialData } from "./data/initialData";
import { PatientObjective } from "./data/objetives";
import { PatientProgress } from "./data/progress";

export type Patient = {
    uid: string,
    displayName: string | undefined,
    photoURL: string | undefined,
    email: string,
    age?: number,
    birthday?: Date,
    height?: number,
    gender?: string,
    physicalActivities?: string[],

    progress: PatientProgress,
    initialData?: PatientInitialData,
    objective?: PatientObjective
}