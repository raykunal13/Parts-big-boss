"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import CustomerLogin from "./CustomerLogin";
import MerchantLogin from "./MerchantLogin";
import LoginStyle from "./LoginStyle";
import { useAuthStore, authStore } from "../store/useAuthStore";

export default function LoginPage() {
  const { activeAuthTab } = useAuthStore();
  
  // Handlers
  const handleTabChange = (type: 'customer' | 'merchant') => {
    authStore.setAuthTab(type);
  }

  return (
    <div className="min-h-screen w-full flex bg-[var(--background)]">
      
      {/* Left Panel - Branding Section (Hidden on mobile) */}
      <LoginStyle />

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        <div className="w-full max-w-[420px] space-y-10">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="text-center lg:hidden mb-8">
             <Link href="/" className="inline-block">
               <span className="font-bold text-2xl text-[var(--foreground)]">PartsBigBoss</span>
             </Link>
          </div>

          <div 
             className="space-y-6"
          >
            {/* Login Type Toggle */}
            <div className="p-1 bg-[var(--surface)] rounded-2xl flex relative">
              <div 
                className="absolute inset-y-1 bg-[var(--background)] rounded-xl shadow-sm transition-all duration-300 ease-spring"
                style={{
                   width: 'calc(50% - 4px)',
                   left: activeAuthTab === 'customer' ? '4px' : 'calc(50%)'
                }}
              />
              <button
                onClick={() => handleTabChange('customer')}
                className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${activeAuthTab === 'customer' ? 'text-[var(--foreground)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
              >
                Customer
              </button>
              <button
                onClick={() => handleTabChange('merchant')}
                className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${activeAuthTab === 'merchant' ? 'text-[var(--foreground)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
              >
                Merchant
              </button>
            </div>
          </div>

          {activeAuthTab === 'customer' ? <CustomerLogin /> : <MerchantLogin />}

        </div>
      </div>
    </div>  
  );
}