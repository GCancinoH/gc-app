
export const AuthSchema = {
    title: "Auth",
    version: 0,
    description: "Database to storage users",
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 50
        },
        name: {
            type: "string",
            maxLength: 50
        },
        email: {
            type: "string",
        },
        password: {
            type: "string",
            maxLength: 30
        },
        role: {
            type: "string",
        },
        token: {
            type: "string",
            maxLength: 100
        },
        emailVerified: {
            type: "boolean"
        }
    },
    encrypted: ["secret"],
    attachments: {
        encrypted: true
    }
}