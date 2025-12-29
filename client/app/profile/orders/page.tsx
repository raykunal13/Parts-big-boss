"use client";

import { Package, Truck, CheckCircle, Clock, ChevronRight } from "lucide-react";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD-29381",
      date: "24 Dec, 2024",
      total: "₹4,299",
      status: "Delivered",
      items: ["Motul 7100 4T 10W-50", "Oil Filter - Hyundai"],
      statusStep: 4 // 1=Placed, 2=Packed, 3=Shipped, 4=Delivered
    },
    {
      id: "ORD-30012",
      date: "28 Dec, 2024",
      total: "₹1,250",
      status: "On the way",
      items: ["Bosch Wiper Blades (Pair)"],
      statusStep: 3
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Pit Stop History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="group bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-md transition-shadow">
            
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--accent)]">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">Order #{order.id}</h3>
                  <p className="text-xs text-[var(--text-muted)]">Placed on {order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-[var(--foreground)]">{order.total}</p>
                <p className="text-xs text-[var(--text-muted)]">{order.items.length} items</p>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="relative mb-6 px-2">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--surface)] -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-[var(--accent)] -translate-y-1/2 rounded-full transition-all duration-500" 
                style={{ width: `${(order.statusStep / 4) * 100}%` }} 
              />
              
              <div className="relative flex justify-between text-xs font-medium text-[var(--text-muted)]">
                {["Placed", "Packed", "Shipped", "Delivered"].map((step, idx) => (
                  <div key={step} className="flex flex-col items-center gap-2 bg-white px-1 z-10">
                    <div className={`w-3 h-3 rounded-full border-2 ${idx + 1 <= order.statusStep ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-white border-gray-300"}`} />
                    <span className={idx + 1 <= order.statusStep ? "text-[var(--foreground)]" : ""}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div className="text-sm text-[var(--text-secondary)]">
                Includes: <span className="font-medium text-[var(--foreground)]">{order.items[0]}</span> {order.items.length > 1 && `+${order.items.length - 1} more`}
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm font-medium text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-hover)]">
                  View Invoice
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-red-700 shadow-sm">
                  Buy Again
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}