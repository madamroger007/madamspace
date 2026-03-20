ALTER TABLE "payment_fee_config"
ADD COLUMN "methods" jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE "payment_fee_config"
SET "methods" = jsonb_build_array(
	jsonb_build_object('methodKey', 'bni_va', 'feeType', 'fixed', 'feeValue', "bank_transfer_fixed_fee", 'vatRate', "vat_rate", 'isActive', true),
	jsonb_build_object('methodKey', 'bri_va', 'feeType', 'fixed', 'feeValue', "bank_transfer_fixed_fee", 'vatRate', "vat_rate", 'isActive', true),
	jsonb_build_object('methodKey', 'mandiri_va', 'feeType', 'fixed', 'feeValue', "bank_transfer_fixed_fee", 'vatRate', "vat_rate", 'isActive', true),
	jsonb_build_object('methodKey', 'qris', 'feeType', 'percent', 'feeValue', "qris_percent", 'vatRate', "vat_rate", 'isActive', true),
	jsonb_build_object('methodKey', 'gopay', 'feeType', 'percent', 'feeValue', "gopay_percent", 'vatRate', "vat_rate", 'isActive', true),
	jsonb_build_object('methodKey', 'dana', 'feeType', 'percent', 'feeValue', "dana_percent", 'vatRate', "vat_rate", 'isActive', true)
)
WHERE "methods" = '[]'::jsonb;
