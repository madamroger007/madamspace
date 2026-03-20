import { ManageOrderFilters } from './types';

type OrdersFilterBarProps = {
    filters: ManageOrderFilters;
    onChange: (next: ManageOrderFilters) => void;
};

export function OrdersFilterBar({ filters, onChange }: OrdersFilterBarProps) {
    return (
        <div className="bg-white shadow text-black rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
                type="text"
                placeholder="Search order id, customer name, or email"
                value={filters.q}
                onChange={(e) => onChange({ ...filters, q: e.target.value })}
                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />

            <select
                value={filters.label}
                onChange={(e) => onChange({ ...filters, label: e.target.value as ManageOrderFilters['label'] })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
                <option value="">All Labels</option>
                <option value="progress">Progress</option>
                <option value="revisi">Revisi</option>
                <option value="done">Done</option>
            </select>
        </div>
    );
}
