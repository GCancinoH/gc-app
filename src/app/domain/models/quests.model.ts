export type DailyQuests = {
    questID: string,
    name: string,
    description: string,
    rewards: QuestRewards,
    points?: number,
    status: QuestStatus,
    createdAt: Date,
    startedAt: Date | null,
    finishedAt: Date | null,
    type: QuestType[] | QuestType,
    details: QuestDetails
}

export type QuestRewards = {
    xp: number,
    coins?: number,
    attributes?: {
        intelligence: number,
        strength: number,
        endurance: number,
        mobility: number,
        health: number
    }
}

export type QuestType = 'STRENGHT' | 'HEALTH' | 'INTELLIGENCE' | 'ENDURANCE' | 'RECOVERY' | 'MOBILITY';

export type QuestStatus = 'QUEST_COMPLETED' | 'QUEST_IN_PROGRESS' | 'QUEST_NOT_STARTED';

export type QuestDetails = StrenghtQuest | ReadingQuest | YogaQuest | MobilityQuest | EnduranceQuest | JournalingQuest | RecoverQuest;

export type StrenghtQuest = {
    kind: 'exercise',
    exercises: ExerciseQuest[],
}

export type ExerciseQuest = {
    exercise: string,
    reps: number,
    km?: number,
    min?: number
}

export type ReadingQuest = {
    kind: 'reading',
    pages: number,
}

export type YogaQuest = {
    kind: 'yoga',
    duration: number
}

export type MobilityQuest = {
    kind: 'mobility',
    duration: number
}

export type EnduranceQuest = {
    kind: 'endurance',
    exercises: EnduranceExercise[]
}

export type EnduranceExercise = {
    exercise: string,
    duration: number
}

export type JournalingQuest = {
    kind: 'journaling',
    duration: number
}

export type RecoverQuest = {
    kind: 'recover',
    duration?: number
}