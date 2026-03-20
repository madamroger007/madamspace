import { desc, eq } from "drizzle-orm";
import { db } from "@/src/server/db";
import {
    InsertPaymentFeeConfig,
    SelectPaymentFeeConfig,
    paymentFeeConfigTable,
} from "@/src/server/db/schema/paymentFeeConfig";

export const paymentFeeConfigRepository = {
    async getLatest(): Promise<SelectPaymentFeeConfig | undefined> {
        const [row] = await db
            .select()
            .from(paymentFeeConfigTable)
            .orderBy(desc(paymentFeeConfigTable.id))
            .limit(1);

        return row;
    },

    async create(data: InsertPaymentFeeConfig): Promise<SelectPaymentFeeConfig> {
        const [created] = await db.insert(paymentFeeConfigTable).values(data).returning();
        return created;
    },

    async updateById(
        id: number,
        data: Partial<InsertPaymentFeeConfig>
    ): Promise<SelectPaymentFeeConfig> {
        const [updated] = await db
            .update(paymentFeeConfigTable)
            .set(data)
            .where(eq(paymentFeeConfigTable.id, id))
            .returning();

        return updated;
    },
};
