import { Clock } from "lucide-react";

export default function PaymentLoadingState() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
            <Clock className="w-12 h-12 text-neon-blue animate-spin" />
            <p className="font-syne text-xl">Loading order details...</p>
        </div>
    );
}
