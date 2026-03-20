import { OrderLabel } from './types';

const labelStyle: Record<OrderLabel, string> = {
    progress: 'bg-yellow-100 text-yellow-800',
    revisi: 'bg-orange-100 text-orange-800',
    done: 'bg-green-100 text-green-800',
};

export function OrderLabelBadge({ label }: { label: string | null | undefined }) {
    const normalized = (label || 'progress').toLowerCase() as OrderLabel;
    const style = labelStyle[normalized] || labelStyle.progress;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {normalized.toUpperCase()}
        </span>
    );
}
