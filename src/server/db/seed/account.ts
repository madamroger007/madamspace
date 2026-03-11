import { authService } from "../../services/auth";

async function seed() {
    const dummyAccounts = [
        {
            email: "admin111@example.com",
            name: "admin",
            password: "hashed_password_here", // Should be properly hashed in production
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            email: "user111@example.com",
            name: "user",
            password: "hashed_password_here",
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    try {
        for (const account of dummyAccounts) {
            await authService.registerUser(account);
        }
        console.log("Account seed data created successfully");
    } catch (error) {
        console.error("Error seeding accounts:", error);
        throw error;
    }
}


seed().catch((err) => {
    console.error(err);
    process.exit(1);
});