import { Order } from '@/src/types/type';

type DeleteOrderModalProps = {
    order: Order | null;
    busy: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
};

export function DeleteOrderModal({ order, busy, onClose, onConfirm }: DeleteOrderModalProps) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Delete order <span className="font-mono">{order.orderId}</span>? This action cannot be undone.
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
                        className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {busy ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
