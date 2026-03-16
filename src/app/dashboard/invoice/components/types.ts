import { Order } from '@/src/types/type';

// ─── Re-exports ──────────────────────────────────────────────────────────────
export type { Order };

export type TransactionStatus =
    | 'settlement'
    | 'capture'
    | 'pending'
    | 'deny'
    | 'cancel'
    | 'expire'
    | 'failure'
    | 'refund'
    | 'partial_refund'
    | 'authorize';

export type StatusBadgeStyle = { bg: string; text: string };

export type TransactionStatusBadge = Record<TransactionStatus, StatusBadgeStyle>;

export interface UseInvoicesReturn {
    orders: Order[];
    loading: boolean;
    error: string;
    selectedOrder: Order | null;
    syncing: boolean;
    setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
    fetchOrders: (sync?: boolean) => Promise<void>;
    removeOrder: (orderId: string) => void;
};

export interface UseInvoiceActionsReturn {
    handleDelete: (orderId: string) => Promise<void>;
}

export interface InvoiceHeaderProps {
    ordersCount: number;
    loading: boolean;
    syncing: boolean;
    error: string;
    onSync: () => void;
    onRefresh: () => void;
}

export interface InvoiceTableProps {
    orders: Order[];
    loading: boolean;
    selectedOrder: Order | null;
    onSelectOrder: (order: Order) => void;
    onDeleteOrder: (orderId: string) => Promise<void>;
    formatCurrency: (amount: number) => string;
    formatDate: (dateString: string | null) => string;
}

export interface InvoiceDetailPanelProps {
    selectedOrder: Order | null;
    onClose: () => void;
    formatCurrency: (amount: number) => string;
    formatDate: (dateString: string | null) => string;
}
