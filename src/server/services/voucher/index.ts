import { voucherRepository } from "../../repositories/voucher";
import { SelectVoucher } from "../../db/schema/voucher";
import { VoucherSchema } from "../../validations/voucher";

export async function getVouchersService() {
    const vouchers = await voucherRepository.getVouchers();
    return vouchers;
}

export async function createVoucherService(data: VoucherSchema) {
    const now = new Date().toISOString();
    const voucherData = {
        ...data,
        createdAt: now,
        updatedAt: now,
    };
    const voucher = await voucherRepository.createVoucher(voucherData);
    return voucher;
}

export async function updateVoucherService(data: SelectVoucher) {
    const idVoucher = await voucherRepository.getVoucherById(data.id)
    if (idVoucher) {
        await voucherRepository.updateVoucher(data)

    }
}

export async function getVoucherByIdService(id: number) {
    const voucher = await voucherRepository.getVoucherById(id);
    return voucher;
}


export async function deleteVoucherService(id: number) {
    const idVoucher = await voucherRepository.getVoucherById(id)
    if (idVoucher) {
        await voucherRepository.deleteVoucher(idVoucher.id)
    }

}