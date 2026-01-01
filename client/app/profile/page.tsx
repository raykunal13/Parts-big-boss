"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Car, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  ShoppingCart,
  Zap,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { useAuthStore, authStore } from "../store/useAuthStore";
import VehicleSelector from "../components/Sections/VehicleSelector"; 
import axios from "axios"; // Import axios
import { toast } from "sonner"; // Or your notification library

export default function ProfileDashboard() {

  const { userGarage, activeVehicle } = useAuthStore();
  const [isAddingCar, setIsAddingCar] = useState(false);

  // Helper to handle switching the "Active Context"
  const handleSwitchVehicle = (vehicleId: number) => {
    // In a real app, this would call the API first
    authStore.switchActiveVehicle(vehicleId); 
    console.log("Switching active vehicle to:", vehicleId);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. THE HEADER (Welcome & Status) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Command Center</h1>
          <p className="text-[var(--text-secondary)]">Manage your vehicles and fitment profile</p>
        </div>
        
        {/* Global Garage Status */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-[var(--border)] shadow-sm">
           <div className="text-right">
             <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Garage Level</p>
             <p className="text-sm font-bold text-[var(--accent)]">Enthusiast (Lvl 2)</p>
           </div>
           <div className="h-10 w-10 rounded-full bg-[var(--surface-hover)] flex items-center justify-center text-[var(--accent)]">
             <Zap size={20} fill="currentColor" />
           </div>
        </div>
      </div>

      {/* 2. ACTIVE CONTEXT CARD (The "Ignition Switch") */}
      {activeVehicle ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-[var(--foreground)] text-[var(--background)] p-6 md:p-8 shadow-2xl shadow-black/20"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active Vehicle
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {activeVehicle.nickname || `${activeVehicle.year} ${activeVehicle.model_name}`}
                </h2>
                <p className="text-white/60 font-mono text-sm">
                  {activeVehicle.make_name} • {activeVehicle.variant_name}
                </p>
              </div>

              {/* Fitment Health Check */}
              <div className="flex items-center gap-3 text-sm">
                {activeVehicle.fitment_completeness >= 80 ? (
                   <div className="flex items-center gap-2 text-green-400">
                     <CheckCircle2 size={16} />
                     <span>Fitment Profile Healthy</span>
                   </div>
                ) : (
                   <div className="flex items-center gap-2 text-orange-400">
                     <AlertTriangle size={16} />
                     <span>Missing Engine Details (Risk of Return)</span>
                   </div>
                )}
              </div>
            </div>

            {/* Quick Actions for Active Car */}
            <div className="flex flex-col gap-3 min-w-[200px]">
               <Link href={`/search?vehicle=${activeVehicle.id}`} className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors">
                  <ShoppingCart size={18} /> Shop Parts
               </Link>
               <button className="flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Wrench size={18} /> Service Log
               </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Empty Active State */
        <div className="p-8 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col items-center text-center space-y-4">
           <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
             <AlertTriangle size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-orange-900">No Active Vehicle Selected</h3>
             <p className="text-sm text-orange-700 max-w-md mx-auto">
               Select a vehicle to unlock accurate fitment filtering and guaranteed part compatibility.
             </p>
           </div>
        </div>
      )}

      {/* 3. MY GARAGE GRID (The Asset List) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--foreground)]">My Garage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Existing Cars */}
          {userGarage.map((car) => (
            <div 
              key={car.id} 
              className={`
                group relative p-5 rounded-2xl border transition-all duration-300
                ${car.is_active 
                  ? "bg-[var(--surface-hover)] border-[var(--accent)] ring-1 ring-[var(--accent)]" 
                  : "bg-white border-[var(--border)] hover:border-[var(--text-secondary)] hover:shadow-md"
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)]">
                  <Car size={20} />
                </div>
                {car.is_active ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] bg-red-50 px-2 py-1 rounded-md">Active</span>
                ) : (
                  <button 
                    onClick={() => handleSwitchVehicle(car.id)}
                    className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] underline decoration-dotted underline-offset-4"
                  >
                    Switch to this
                  </button>
                )}
              </div>

              <div>
                <h4 className="font-bold text-[var(--foreground)] truncate">{car.nickname || car.model_name}</h4>
                <p className="text-xs text-[var(--text-muted)] font-mono mt-1">{car.variant_name}</p>
              </div>

              {/* Fitment Bar */}
              <div className="mt-4 space-y-1.5">
                 <div className="flex justify-between text-[10px] font-medium text-[var(--text-secondary)]">
                   <span>Profile Completeness</span>
                   <span>{car.fitment_completeness}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${car.fitment_completeness === 100 ? "bg-green-500" : "bg-orange-400"}`} 
                     style={{ width: `${car.fitment_completeness}%` }}
                   />
                 </div>
              </div>
            </div>
          ))}

          {/* Add New Vehicle Card */}
          <button 
            onClick={() => setIsAddingCar(true)}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-red-50/10 transition-all min-h-[180px]"
          >
            <div className="h-12 w-12 rounded-full bg-[var(--surface)] group-hover:bg-white flex items-center justify-center transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-medium text-sm">Add Another Vehicle</span>
          </button>

        </div>
      </div>

      {/* 4. BUY AGAIN SHELF (Placeholder for Phase 3) */}
      <div className="pt-4 border-t border-[var(--border)]">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Quick Reorder</h3>
            <span className="text-xs text-[var(--text-muted)]">Based on your maintenance history</span>
         </div>
         
         <div className="flex items-center justify-center p-8 bg-[var(--surface)] rounded-xl border border-dashed border-[var(--border)]">
             <div className="text-center space-y-2">
                <Wrench className="mx-auto text-[var(--text-muted)]" size={24} />
                <p className="text-sm text-[var(--text-secondary)]">No maintenance history found yet.</p>
                <p className="text-xs text-[var(--text-muted)]">Items like Oil, Filters, and Wipers will appear here after your first purchase.</p>
             </div>
         </div>
      </div>

      {/* Add Vehicle Modal Placeholder */}
      {/* You would wrap your VehicleSelector component in a standardized Modal here */}
      {isAddingCar && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Add to Garage</h3>
        <button onClick={() => setIsAddingCar(false)} className="text-gray-400 hover:text-black">
          Close
        </button>
      </div>
      
      <div className="mt-2 text-left">
        {/* THE MAGIC FIX IS HERE */}
        <VehicleSelector 
           variant="modal" // Makes it look cleaner
           onConfirm={async (selection) => {
             try {
               // 1. Call your Backend API to add the vehicle
               // (This matches your userVehicle.controller.js logic)
               console.log(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/vehicles`, {
                   vehicle_variant_id: selection.variantId, // Assuming 'year' value is actually the variant ID based on your selector logic
                   nickname: `${selection.makeName} ${selection.modelName}` // Optional default nickname
                 });
               await axios.post(
                 `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/vehicles`,
                 {
                   variantId: selection.variantId, // Assuming 'year' value is actually the variant ID based on your selector logic
                   nickname: `${selection.makeName} ${selection.modelName}` // Optional default nickname
                 },
                 { withCredentials: true }
               );

               // 2. Success Feedback
               alert("Vehicle Added Successfully!"); // Replace with toast.success()
               
               // 3. Refresh the garage list (if you have a refresh function)
               // bootstrapAuth(); 
               
               // 4. Close Modal
               setIsAddingCar(false);

             } catch (error) {
               console.error("Failed to add vehicle", error);
               alert("Failed to add vehicle");
             }
           }}
        />
      </div>
    </div>
  </div>
)}

    </div>

  );
}