import { DailyQuests } from "@domain/models/quests.model";

export const initialReps = {
    'PUSH_UPS': 5,
    'PULL_UPS': 3,
    'SQUATS': 5,
    'RAISE_UPS': 3,
    'RUNNING': 0.5
}

export const quests: DailyQuests[] = [
    {
        questID: '001',
        name: 'STRENGTH_QUEST',
        description: 'STRENGTH_QUEST_DESCRIPTION',
        rewards: {
            xp: 15
        },
        status: 'QUEST_NOT_STARTED',
        createdAt: new Date(),
        startedAt: null,
        finishedAt: null,
        type: 'STRENGHT',
        details: {
            kind: 'exercise',
            exercises: [
                { exercise: 'PUSH_UPS', reps: initialReps.PUSH_UPS },
                { exercise: 'PULL_UPS', reps: initialReps.PULL_UPS },
                { exercise: 'SQUATS', reps: initialReps.SQUATS },
                { exercise: 'RAISE_UPS', reps: initialReps.RAISE_UPS},
                { exercise: 'RUNNING', reps: 0, km: initialReps.RUNNING }
            ]
        }
    },
    {
        questID: '002',
        name: 'COLD_SHOWER_QUEST',
        description: 'COLD_SHOWER_QUEST_DESCRIPTION',
        rewards: {
            xp: 5
        },
        status: 'QUEST_NOT_STARTED',
        createdAt: new Date(),
        startedAt: null,
        finishedAt: null,
        type: 'RECOVERY',
        details: {
            kind: 'recover'
        }
    },
    {
        questID: '003',
        name: 'SLEEP_QUEST',
        description: 'SLEEP_QUEST_DESCRIPTION',
        rewards: {
            xp: 10
        },
        status: 'QUEST_NOT_STARTED',
        createdAt: new Date(),
        startedAt: null,
        finishedAt: null,
        type: 'RECOVERY',
        details: {
            kind: 'recover'
        }
    }
]