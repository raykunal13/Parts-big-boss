import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function LoginStyle() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[var(--base-dark)] text-white flex-col justify-between p-16">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[#0a0a0a]">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--brand-red)] to-[var(--brand-navy)] opacity-20" />
         <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] rounded-full bg-[var(--brand-red)] mix-blend-screen filter blur-[120px] opacity-20" />
         <div className="absolute bottom-[0%] left-[0%] w-[60%] h-[60%] rounded-full bg-[var(--brand-navy)] mix-blend-screen filter blur-[100px] opacity-20" />
      </div>

      {/* Content Content layer */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            PartsBigBoss
          </span>
        </Link>
      </div>

      <div className="relative z-10 space-y-6 max-w-lg">
         <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
           Drive Your Business Forward.
         </h1>
         <p className="text-lg text-white/70 leading-relaxed font-light">
           Access thousands of premium auto parts, manage your garage, and track orders in real-time. Join the network of professionals.
         </p>
         
         <div className="pt-8 space-y-4">
           {[
             "Premium Quality Components",
             "Real-time Inventory Tracking", 
             "24/7 Expert Support"
           ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 size={20} className="text-[var(--brand-red-hot)]" />
                <span className="font-medium">{item}</span>
              </div>
           ))}
         </div>
      </div>

      <div className="relative z-10 text-xs text-white/40 font-medium tracking-wide uppercase">
        © 2024 Parts Big Boss. All Rights Reserved.
      </div>
    </div>
  );
}
