export type PatientProgress = {
    level: number,
    exp: number,
    currentCategory: string;
    lastLevelUpdate?: Date;
    lastCategoryUpdate?: Date;
}