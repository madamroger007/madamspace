CREATE TABLE "payment_fee_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_transfer_fixed_fee" integer DEFAULT 4000 NOT NULL,
	"qris_percent" numeric(8, 4) DEFAULT '0.0070' NOT NULL,
	"gopay_percent" numeric(8, 4) DEFAULT '0.0200' NOT NULL,
	"dana_percent" numeric(8, 4) DEFAULT '0.0150' NOT NULL,
	"vat_rate" numeric(8, 4) DEFAULT '0.1200' NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
