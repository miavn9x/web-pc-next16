"use client";

import { useAuthModal } from '@/features/auth/shared/contexts/AuthModalContext';
import { User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthButtons = () => {
    const { openModal } = useAuthModal();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Check authentication status on mount and when cookies change
    useEffect(() => {
        const checkAuth = () => {
            const hasToken = document.cookie.includes('accessToken=');
            setIsAuthenticated(hasToken);
        };
        
        checkAuth();
        
        // Re-check periodically in case cookie changes
        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, []);
    
    const handleOpenModal = (type: "login" | "register") => (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(type);
    };

    if (isAuthenticated) {
        return (
            <div className="relative group z-50">
                {/* Trigger Button */}
                <div 
                    className="flex items-center gap-1 lg:gap-3 cursor-pointer lg:hover:bg-white/10 px-1 lg:px-2 py-1.5 rounded-md transition-colors duration-200"
                >
                    <User className="w-6 h-6 lg:w-[26px] lg:h-[26px] text-gray-700 lg:text-white" strokeWidth={1.5} />
                    <div className="hidden lg:flex flex-col leading-tight lg:text-white">
                        <span className="text-[11px] opacity-80">Xin chào</span>
                        <span className="text-[13px] font-semibold flex items-center gap-1">
                            Tài khoản <span className="text-[10px] opacity-60">▼</span>
                        </span>
                    </div>
                </div>

                {/* Dropdown Menu */}

            </div>
        );
    }
    
    // If not authenticated, show login/register buttons
    return (
        <div className="relative group z-50">
            {/* Trigger Button */}
            <div 
                onClick={handleOpenModal("login")} 
                className="flex items-center gap-1 lg:gap-3 cursor-pointer lg:hover:bg-white/10 px-1 lg:px-2 py-1.5 rounded-md transition-colors duration-200"
            >
                <User className="w-6 h-6 lg:w-[26px] lg:h-[26px] text-gray-700 lg:text-white" strokeWidth={1.5} />
                <div className="hidden lg:flex flex-col leading-tight lg:text-white">
                    <span className="text-[11px] opacity-80">Đăng nhập</span>
                    <span className="text-[13px] font-semibold flex items-center gap-1">
                        Tài khoản <span className="text-[10px] opacity-60">▼</span>
                    </span>
                </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 pt-2 w-[260px] hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-100 flex flex-col gap-3 relative before:absolute before:top-[-8px] before:right-6 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-t before:border-l before:border-gray-100">
                     <button 
                        type="button" 
                        onClick={handleOpenModal("login")} 
                        className="w-full py-2.5 bg-[#FFD400] hover:bg-[#FFC400] text-[#103E8F] font-bold text-center rounded-md transition-colors shadow-sm uppercase text-sm block"
                     >
                        Đăng nhập
                     </button>
                     <button 
                        type="button" 
                        onClick={handleOpenModal("register")} 
                        className="w-full py-2.5 bg-[#FFD400] hover:bg-[#FFC400] text-[#103E8F] font-bold text-center rounded-md transition-colors shadow-sm uppercase text-sm block"
                     >
                        Tạo tài khoản
                     </button>
                </div>
            </div>
        </div>
    );
};

export default AuthButtons;