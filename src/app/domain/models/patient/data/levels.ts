export interface Levels {
    CATEGORY_BEGINNER: { [level: number]: number };
    CATEGORY_INTERMEDIATE: { [level: number]: number };
    CATEGORY_ADVANCED: { [level: number]: number };
}

export const levels: Levels = {
    CATEGORY_BEGINNER: {
        0: 0,
        1: 100,
        2: 250,
        3: 500,
        4: 650,
        5: 800
    },
    CATEGORY_INTERMEDIATE: {
        1: 251,
        2: 500,
    },
    CATEGORY_ADVANCED: {
        1: 501,
        2: 750,
    },
};
