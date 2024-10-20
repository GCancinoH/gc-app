interface Levels {
    Beginner: { [level: number]: number };
    Intermediate: { [level: number]: number };
    Advanced: { [level: number]: number };
}

export const levels: Levels = {
    Beginner: {
        1: 100,
        2: 250,
        3: 500,
        4: 650,
        5: 800
    },
    Intermediate: {
        1: 251,
        2: 500,
    },
    Advanced: {
        1: 501,
        2: 750,
    },
};
