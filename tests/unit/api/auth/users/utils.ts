import { SelectUser } from "@/src/server/db/schema/user";
// Helper function to create a mock user
export function makeUser(): SelectUser {
    return {
        id: 'user-1',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashed-password',
        role: 'admin',
        resetPasswordToken: null,
        resetPasswordExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}


