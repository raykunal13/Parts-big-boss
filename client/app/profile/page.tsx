"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function MyGarage() {
  const [shopForCar, setShopForCar] = useState(true);

  // Mock Data
  const vehicles = [
    { id: 1, name: "2018 Hyundai Creta", engine: "1.6L Diesel CRDi", trim: "SX Option", primary: true, image: "/Category/categ1.png", color: "Polar White" },
    { id: 2, name: "2021 Royal Enfield", engine: "350cc", trim: "Classic", primary: false, image: "/Category/categ2.png", color: "Stealth Black" },
  ];

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
    >
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] mb-2">My Garage</h1>
          <p className="text-[var(--text-muted)] text-lg">Manage your fleet and fitment preferences.</p>
        </div>
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-[var(--foreground)] text-white px-6 py-3 rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl hover:bg-black transition-all"
        >
          <Plus size={18} /> 
          <span className="font-semibold">Add Vehicle</span>
        </motion.button>
      </div>

      {/* Primary Vehicle Hero Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 group">
        
        {/* Dynamic Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Car Image Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full lg:w-1/2 aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center"
          >
             {/* Glowing backdrop behind car */}
             <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-gray-50 rounded-3xl -z-10" />
             <div className="relative z-10 w-full h-full flex items-center justify-center p-6 mix-blend-multiply">
                 {/* Fallback if image fails or just use the div as present in original, but try Image first */}
                 <div className="w-full h-full rounded-2xl flex items-center justify-center relative transform group-hover:scale-105 transition-transform duration-700 ease-out">
                    <img src={vehicles[0].image} alt={vehicles[0].name} className="object-contain w-full h-full drop-shadow-2xl" />
                 </div>
             </div>
          </motion.div>

          {/* Info Area */}
          <div className="flex-1 w-full space-y-8">
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100 shadow-sm">
                        <CheckCircle2 size={14} /> Primary
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                        <ShieldCheck size={14} /> Verified Fit
                    </div>
                </div>
                
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-[var(--foreground)] tracking-tight leading-none mb-2">
                        {vehicles[0].name}
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] font-medium">
                        {vehicles[0].trim} <span className="text-gray-300 mx-2">|</span> {vehicles[0].engine}
                    </p>
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent" />

            {/* Actions Panel */}
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors hover:bg-gray-50/50 shadow-sm">
                {/* Custom Toggle */}
                <label className="flex items-center gap-4 cursor-pointer group/toggle select-none">
                    <div className="relative">
                        <input type="checkbox" checked={shopForCar} onChange={() => setShopForCar(!shopForCar)} className="sr-only peer" />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--accent)] transition-all duration-300 shadow-inner"></div>
                        <div className="absolute top-[4px] left-[4px] bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-6 flex items-center justify-center">
                            {shopForCar && <Zap size={12} className="text-[var(--accent)]" />}
                        </div>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-[var(--foreground)]">Shop for this car</span>
                        <span className="block text-xs text-[var(--text-muted)]">Parts will match this model</span>
                    </div>
                </label>

                <div className="flex items-center gap-2">
                    <button className="p-3 text-[var(--text-secondary)] hover:bg-white hover:text-[var(--foreground)] hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-gray-100">
                        <Edit2 size={20} />
                    </button>
                    <button className="p-3 text-[var(--text-secondary)] hover:bg-white hover:text-red-600 hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-red-50">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="pt-8">
        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-6">Other Machines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Secondary Car Card */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--accent)]/30 transition-all cursor-pointer group flex items-start gap-5 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="h-24 w-32 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 relative z-10 transition-transform group-hover:scale-105 border border-gray-100">
                    <img src={vehicles[1].image} alt={vehicles[1].name} className="object-contain w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 relative z-10 pt-1">
                    <h4 className="font-bold text-xl text-[var(--foreground)] leading-tight mb-1">{vehicles[1].name}</h4>
                    <p className="text-sm text-[var(--text-muted)] font-medium mb-3">{vehicles[1].engine}</p>
                    
                    <div className="flex items-center text-xs font-bold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                        MANAGE <ArrowRight size={14} className="ml-1" />
                    </div>
                </div>
            </motion.div>

            {/* Add New Slot */}
            <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(249, 250, 251, 1)" }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all bg-transparent min-h-[160px]"
            >
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-bold text-lg">Add Another Vehicle</span>
            </motion.button>
        </div>
      </div>

    </motion.div>
  );
}