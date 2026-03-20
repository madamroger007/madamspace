import { Order } from '@/src/types/type';

type SendEmailModalProps = {
    order: Order | null;
    busy: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
};

export function SendEmailModal({ order, busy, onClose, onConfirm }: SendEmailModalProps) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">Send Confirmation Email</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Send email to <span className="font-semibold">{order.customerEmail || '-'}</span> for order
                    <span className="font-mono"> {order.orderId}</span>?
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={busy}
                        className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {busy ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}
