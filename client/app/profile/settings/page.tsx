"use client";

import { useState } from "react";
import { Save, User, MapPin, Bell, Shield, Plus, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'security' | 'notifications'>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'address', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const;

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Settings</h1>
        <p className="text-[var(--text-muted)]">Manage your account preferences and personal details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm sticky top-32">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 last:mb-0
                            ${activeTab === tab.id 
                                ? "bg-[var(--surface-hover)] text-[var(--foreground)] shadow-sm" 
                                : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-gray-50"
                            }
                        `}
                    >
                        <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} className={activeTab === tab.id ? "text-[var(--accent)]" : "text-[var(--text-muted)]"} />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
           <AnimatePresence mode="wait">
             <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
             >
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'address' && <AddressSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

function ProfileSettings() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="h-24 w-24 rounded-full bg-[var(--surface-hover)] border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-[var(--accent)] relative group cursor-pointer overflow-hidden">
                        KR
                        <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                            Change
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)]">Kunal Ray</h3>
                        <p className="text-sm text-[var(--text-muted)]">Garage Boss</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">First Name</label>
                        <input type="text" defaultValue="Kunal" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)]/50 border border-gray-200 focus:bg-white focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 text-[var(--foreground)] outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Last Name</label>
                        <input type="text" defaultValue="Ray" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)]/50 border border-gray-200 focus:bg-white focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 text-[var(--foreground)] outline-none transition-all" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Email Address</label>
                         <div className="relative">
                            <input type="email" defaultValue="kunal.ray@example.com" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)]/50 border border-gray-200 focus:bg-white focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 text-[var(--foreground)] outline-none transition-all" />
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                         </div>
                    </div>
                     <div className="space-y-2 md:col-span-2">
                         <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Phone Number</label>
                         <div className="relative">
                            <input type="tel" defaultValue="+91 99999 88888" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)]/50 border border-gray-200 focus:bg-white focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 text-[var(--foreground)] outline-none transition-all" />
                             <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                         </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 bg-[var(--foreground)] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-black/10 hover:shadow-xl hover:bg-black transition-all active:scale-95">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

function AddressSettings() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-[var(--foreground)]">Saved Addresses</h3>
                 <button className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/5 px-4 py-2 rounded-lg transition-colors">
                    <Plus size={16} /> Add New
                 </button>
            </div>

            <div className="grid gap-4">
                {/* Address Card 1 */}
                <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm relative group hover:border-[var(--accent)]/30 transition-all">
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)]">Edit</button>
                         <div className="w-px h-4 bg-gray-200"></div>
                         <button className="text-xs font-semibold text-red-500 hover:text-red-700">Delete</button>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-[var(--foreground)]">Home</h4>
                                <span className="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded">Default</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                1204, Tower B, Prestige Greenmoore,<br />
                                Koramangala 4th Block,<br />
                                Bengaluru, Karnataka - 560034
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SecuritySettings() {
    return (
        <div className="space-y-6">
             <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8 space-y-8">
                 <h3 className="text-lg font-bold text-[var(--foreground)]">Change Password</h3>
                 
                 <div className="space-y-4 max-w-md">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">Current Password</label>
                        <div className="relative">
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)]/50 border border-gray-200 focus:bg-white focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 text-[var(--foreground)] outline-none transition-all" />
                            <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] ml-1">New Password</label>
                        <div className="relative">
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-[var(--surface)]/50 border border-gray-200 focus:bg-white focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 text-[var(--foreground)] outline-none transition-all" />
                        </div>
                     </div>
                 </div>

                 <div className="pt-2">
                    <button className="flex items-center gap-2 bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] px-6 py-2.5 rounded-xl font-medium hover:bg-[var(--surface-hover)] transition-all">
                        Update Password
                    </button>
                 </div>
             </div>
        </div>
    )
}

function NotificationSettings() {
    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8">
             <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Preferences</h3>
             <div className="space-y-6">
                {['Order Updates', 'Promotions & Offers', 'Security Alerts', 'New Arrivals'].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div>
                            <h4 className="font-medium text-[var(--foreground)]">{item}</h4>
                            <p className="text-xs text-[var(--text-muted)]">Receive updates via email and SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={idx !== 1} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                        </label>
                    </div>
                ))}
             </div>
        </div>
    )
}