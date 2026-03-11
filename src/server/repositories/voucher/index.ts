import { eq } from 'drizzle-orm';
import { db } from '@/src/server/db';
import { InsertVoucher, SelectVoucher, voucherTable } from '@/src/server/db/schema/voucher';


export const voucherRepository = {
    /**
     * Get all vouchers
     */

    async getVouchers(): Promise<SelectVoucher[]> {
        return db.select().from(voucherTable);
    },

    /**
     * Get voucher by ID
     */
    async getVoucherById(id: number | undefined): Promise<SelectVoucher | undefined> {
        if (!id) return undefined;
        const result = await db.select().from(voucherTable).where(eq(voucherTable.id, id)).limit(1);
        return result[0];
    },

    /**
     *  
     * 
     * Create a new voucher
     * */
    async createVoucher(data: InsertVoucher) {
        await db.insert(voucherTable).values(data)
    },

    /**
     * Update an existing voucher
     */
    async updateVoucher(data: SelectVoucher) {
        await db.update(voucherTable).set(data).where(eq(voucherTable.id, data.id));

    },

    /**
     * Delete a voucher
     */
    async deleteVoucher(id: number): Promise<void> {
        await db.delete(voucherTable).where(eq(voucherTable.id, id));
    },


};