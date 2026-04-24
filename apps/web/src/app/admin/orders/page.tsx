"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { 
  ShoppingBag, 
  Clock, 
  Car, 
  MapPin, 
  CheckCircle2, 
  Timer,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: any = {
  "pending": "bg-gray-900/40 text-gray-400 border-gray-800",
  "preparing": "bg-blue-900/20 text-blue-400 border-blue-500/30",
  "ready": "bg-[#FFA500]/10 text-[#FFA500] border-[#FFA500]/30",
  "completed": "bg-green-900/20 text-green-500 border-green-500/30",
  "cancelled": "bg-red-900/20 text-red-500 border-red-500/30",
};

export default function OrdersFeedPage() {
  const orders = useQuery(api.admin_orders.getLiveOrders);
  const updateStatus = useMutation(api.admin_orders.updateOrderStatus);

  if (!orders) return <div className="p-8 animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-40 bg-[#111] rounded-xl" />)}</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">LIVE ORDERS</h1>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2 flex items-center gap-2">
            Real-Time Fulfillment Monitoring <span className="w-1 h-1 bg-[#FFA500] rounded-full animate-pulse" />
          </p>
        </div>
        <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-lg px-4 py-2">
           <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Active Orders</p>
           <p className="text-white font-black text-xl">{orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="bg-[#0f0f11] border border-dashed border-[#222] rounded-xl py-32 flex flex-col items-center justify-center text-center">
             <ShoppingBag size={48} className="text-gray-800 mb-6" />
             <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">No orders in the last 24 hours</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl overflow-hidden hover:border-[#222] transition-colors group">
              <div className="p-6 flex flex-col lg:flex-row gap-8">
                {/* Order Meta */}
                <div className="flex-1 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-[#161618] rounded-lg flex items-center justify-center border border-[#222]">
                            <ShoppingBag size={18} className="text-[#FFA500]" />
                         </div>
                         <div>
                            <p className="text-white font-black text-sm uppercase tracking-tight">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</p>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{new Date(order._creationTime).toLocaleTimeString()}</p>
                         </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border",
                        statusColors[order.status || "pending"]
                      )}>
                        {order.status || "pending"}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-[#161618]">
                      <div>
                         <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> Destination</p>
                         <p className="text-white font-bold text-xs uppercase">{order.destination || "In-Store"}</p>
                      </div>
                      <div>
                         <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> Pickup Time</p>
                         <p className="text-white font-bold text-xs">{order.pickupTime || "ASAP"}</p>
                      </div>
                      {order.carDetails && (
                        <div>
                           <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Car size={10} /> Vehicle</p>
                           <p className="text-white font-bold text-xs uppercase">{order.carDetails.color} {order.carDetails.make} {order.carDetails.model}</p>
                        </div>
                      )}
                   </div>
                </div>

                {/* Items Summary */}
                <div className="lg:w-80 bg-[#0a0a0a] rounded-lg p-4 border border-[#161618]">
                   <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Items ({order.items.length})</h4>
                   <div className="space-y-2">
                      {order.items.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-bold">
                           <span className="text-gray-300">{item.quantity}x {item.name}</span>
                           <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-[10px] text-[#FFA500] font-bold uppercase pt-1">+{order.items.length - 3} more items</p>
                      )}
                   </div>
                   <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-600 uppercase">Total</span>
                      <span className="text-white font-black text-sm tracking-tighter">${order.total.toFixed(2)}</span>
                   </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                   {order.status !== "preparing" && order.status !== "ready" && order.status !== "completed" && (
                     <button 
                      onClick={() => updateStatus({ orderId: order._id, status: "preparing" })}
                      className="w-full py-2.5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded hover:bg-blue-500 transition-colors"
                     >
                       START PREPARING
                     </button>
                   )}
                   {order.status === "preparing" && (
                     <button 
                      onClick={() => updateStatus({ orderId: order._id, status: "ready" })}
                      className="w-full py-2.5 bg-[#FFA500] text-black font-black text-[10px] uppercase tracking-widest rounded hover:bg-orange-400 transition-colors"
                     >
                       MARK AS READY
                     </button>
                   )}
                   {order.status === "ready" && (
                     <button 
                      onClick={() => updateStatus({ orderId: order._id, status: "completed" })}
                      className="w-full py-2.5 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded hover:bg-green-500 transition-colors"
                     >
                       COMPLETE ORDER
                     </button>
                   )}
                   <button className="w-full py-2.5 bg-[#161618] text-gray-400 font-black text-[10px] uppercase tracking-widest rounded border border-[#222] hover:bg-[#222] transition-colors">
                     VIEW DETAILS
                   </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
