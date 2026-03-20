'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'success' | 'error';

type DashboardToast = {
    id: number;
    message: string;
    type: ToastType;
    onClose?: () => void;
};

type ShowToastOptions = {
    onClose?: () => void;
};

type DashboardToastContextValue = {
    showToast: (message: string, type?: ToastType, options?: ShowToastOptions) => void;
};

const DashboardToastContext = createContext<DashboardToastContextValue | null>(null);

export function DashboardToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<DashboardToast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success', options?: ShowToastOptions) => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        setToasts((prev) => [...prev, { id, message, type, onClose: options?.onClose }]);

        setTimeout(() => {
            setToasts((prev) => {
                const target = prev.find((toast) => toast.id === id);
                if (target?.onClose) {
                    target.onClose();
                }
                return prev.filter((toast) => toast.id !== id);
            });
        }, 5000);
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <DashboardToastContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[320px] flex-col gap-3 sm:right-6 sm:top-6">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-enter pointer-events-auto overflow-hidden rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${toast.type === 'success'
                            ? 'border-emerald-400/40 bg-emerald-500/90 text-white'
                            : 'border-red-400/40 bg-red-500/90 text-white'
                            }`}
                    >
                        <p className="text-sm font-medium">{toast.message}</p>
                        <div className="mt-2 h-1 w-full rounded bg-white/30">
                            <div className="toast-progress h-full rounded bg-white/80" />
                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes dashboard-toast-enter {
                    from {
                        opacity: 0;
                        transform: translateX(24px) translateY(-6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) translateY(0);
                    }
                }

                @keyframes dashboard-toast-progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                .toast-enter {
                    animation: dashboard-toast-enter 220ms ease-out;
                }

                .toast-progress {
                    animation: dashboard-toast-progress 5s linear forwards;
                }
            `}</style>
        </DashboardToastContext.Provider>
    );
}

export function useDashboardToast() {
    const context = useContext(DashboardToastContext);
    if (!context) {
        throw new Error('useDashboardToast must be used within DashboardToastProvider');
    }

    return context;
}
