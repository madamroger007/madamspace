import { eq } from 'drizzle-orm';
import { db } from '@/src/server/db';
import { apiTokensTable, InsertApiToken, SelectApiToken } from '@/src/server/db/schema/token';

export const tokenRepository = {
    /**
     * Create a new API token row (stores hashed value)
     */
    async createToken(data: InsertApiToken): Promise<SelectApiToken> {
        const [token] = await db.insert(apiTokensTable).values(data).returning();
        return token;
    },

    /**
     * Find token row by its SHA-256 hash
     */
    async findByTokenHash(tokenHash: string): Promise<SelectApiToken | undefined> {
        const [token] = await db
            .select()
            .from(apiTokensTable)
            .where(eq(apiTokensTable.tokenHash, tokenHash))
            .limit(1);
        return token;
    },

    /**
     * List all tokens for a user (without hash)
     */
    async findByUserId(userId: string): Promise<SelectApiToken[]> {
        return db
            .select()
            .from(apiTokensTable)
            .where(eq(apiTokensTable.userId, userId));
    },

    /**
     * Delete a single token by ID
     */
    async deleteToken(id: string): Promise<void> {
        await db.delete(apiTokensTable).where(eq(apiTokensTable.id, id));
    },

    /**
     * Delete all tokens belonging to a user
     */
    async deleteAllByUserId(userId: string): Promise<void> {
        await db.delete(apiTokensTable).where(eq(apiTokensTable.userId, userId));
    },
};

export type TokenRepository = typeof tokenRepository;
