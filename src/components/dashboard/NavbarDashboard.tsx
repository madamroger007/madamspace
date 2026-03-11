"use client";
import { useDashboard } from '@/src/store/context/AuthUserContext';
import Link from 'next/link';
import { ArrowBigLeft } from "lucide-react"
import { usePathname } from 'next/navigation';

export default function NavbarDashboard({ menuTitle }: { menuTitle: string }) {
    const pathname = usePathname()

    const { user, handleLogout } = useDashboard();

    return (
        <>
            <nav className="bg-gray-600 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-5">
                            {pathname !== "/dashboard" && <Link href={"/dashboard"}><ArrowBigLeft className="text-gray-100" /></Link>}
                            <h1 className="text-xl font-semibold text-gray-100">{menuTitle}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-300">
                                {user?.name} ({user?.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-red-500 hover:text-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );

}