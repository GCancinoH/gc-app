export type PatientInitialData = {
    bodyComposition: InitialBodyComposition,
    measures?: InitialMeasures
}

export type InitialBodyComposition = {
    weight: number,
    bmi: number,
    visceralFat: number,
    bodyFat: number,
    muscleMass: number,
}

export type InitialMeasures = {
    neck: number,
    shoulders: number,
    chest: number,
    back: number, 
    umbilical: number,
    waist: number,
    hip: number,
    armRelax: number,
    armFlex: number,
    thighRelax: number,
    thighFlex: number,
    calfRelax: number,
    calfFlex: number
}