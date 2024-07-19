
export const AuthSchema = {
    title: "Auth",
    version: 0,
    description: "Database to storage users",
    primaryKey: "uid", // Use 'uid' as the primary key
    type: "object",
    properties: {
        uid: {
            type: "string",
            maxLength: 50
        },
        displayName: {
            type: "string",
            maxLength: 50,
            unique: true
        },
        email: {
            type: "string"
        },
        role: {
            type: "string"
        },
        token: {
            type: "string",
            maxLength: 100
        },
        emailVerified: {
            type: "boolean"
        },
        isLoggedIn: {
            type: "boolean"
        },
        attachments: {
            type: "object",
            encrypted: true
        }
    },
    required: ['uid', 'email', 'isLoggedIn'],
};