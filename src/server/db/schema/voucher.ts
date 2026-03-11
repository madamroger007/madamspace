import { decimal, pgTable, serial, text } from "drizzle-orm/pg-core";

export const voucherTable = pgTable('voucher', {
    id: serial('id').primaryKey(),
    code: text('code').notNull().unique(),
    discount: decimal('discount', { precision: 10, scale: 2 }).notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
    expiredAt: text('expired_at').notNull(),
});

export type InsertVoucher = typeof voucherTable.$inferInsert;
export type SelectVoucher = typeof voucherTable.$inferSelect;
