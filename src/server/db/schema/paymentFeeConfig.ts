import { sql } from "drizzle-orm";
import { decimal, integer, jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

export type PaymentFeeRule = {
    methodKey: string;
    feeType: "fixed" | "percent";
    feeValue: number;
    vatRate: number;
    isActive: boolean;
};

export const paymentFeeConfigTable = pgTable("payment_fee_config", {
    id: serial("id").primaryKey(),
    bankTransferFixedFee: integer("bank_transfer_fixed_fee").notNull().default(4000),
    qrisPercent: decimal("qris_percent", { precision: 8, scale: 4 }).notNull().default("0.0070"),
    gopayPercent: decimal("gopay_percent", { precision: 8, scale: 4 }).notNull().default("0.0200"),
    danaPercent: decimal("dana_percent", { precision: 8, scale: 4 }).notNull().default("0.0150"),
    vatRate: decimal("vat_rate", { precision: 8, scale: 4 }).notNull().default("0.1200"),
    methods: jsonb("methods").$type<PaymentFeeRule[]>().notNull().default(sql`'[]'::jsonb`),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
});

export type InsertPaymentFeeConfig = typeof paymentFeeConfigTable.$inferInsert;
export type SelectPaymentFeeConfig = typeof paymentFeeConfigTable.$inferSelect;
