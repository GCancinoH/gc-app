import { Timestamp } from "@angular/fire/firestore";

export interface WorkoutSession {
    name: string;
    uid: string;
    date: Timestamp;
    strengthTraining: StrengthTraining[];
    mobilityTraining: MobilityTraining[];
    plyometricTraining: PlyometricTraining[];
    cardioTraining: CardioTraining[];
}

export interface PlyometricTraining {}
export interface CardioTraining {}
export interface MobilityTraining {}

/* Strength Training Models */
export interface StrengthTraining {
    name: string;
    warmUp: WarmUp[];
    workout: (Exercise | SuperSet | RestPause)[];
    coolOff: CoolOff[];
}

export interface WarmUp {
    name: string;
    exercises: WarmUpExercise[];
}

export interface CoolOff {
    name: string;
    exercises: WarmUpExercise[];
}

export interface WarmUpExercise {
    name: string;
    sets: WarmUpSet[];
}

export interface WarmUpSet {
    reps: number;
    rest: number;
}

export interface SuperSet {
    exercises: Exercise[];
}

export interface RestPause {
    exercises: Exercise[];
}

export interface Exercise {
    name: string;
    warmUpSets: Set[];
    workingSets: Set[];
}

export interface Set {
    reps: number;
    orm?: number;
    rpe?: number;
    rir?: number;
    rest: number;
}