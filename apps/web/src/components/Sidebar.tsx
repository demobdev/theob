"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Trophy, 
  ShoppingBag, 
  Gamepad2, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { name: "Loyalty", href: "/admin/loyalty", icon: Trophy },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Sports", href: "/admin/sports", icon: Gamepad2 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E31837] rounded flex items-center justify-center font-black text-white">
            B
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-white leading-none">THE OB</h1>
            <p className="text-[10px] font-bold tracking-tighter text-[#666] mt-1 uppercase">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-[#161618] text-[#FFA500] border border-[#222]" 
                  : "text-gray-400 hover:text-white hover:bg-[#111]"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={cn(isActive ? "text-[#FFA500]" : "text-gray-500 group-hover:text-white")} />
                <span className="text-xs font-bold tracking-wide uppercase">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-[#FFA500]" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-[#1a1a1a] bg-[#050505]">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">Identity</span>
              <span className="text-xs font-bold text-white truncate max-w-[100px]">ADMIN</span>
            </div>
          </div>
          <Link href="/" title="Exit Dashboard" className="text-gray-600 hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
