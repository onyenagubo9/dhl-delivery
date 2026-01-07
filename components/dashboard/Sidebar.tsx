"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col shadow-xl">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">
            🚚
          </div>
          <span className="text-lg font-bold tracking-wide">
            Global Delivery
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavItem
          href="/dashboard/customer"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/dashboard/customer"}
        />

        <NavItem
          href="/dashboard/customer"
          icon={Package}
          label="My Orders"
          active={pathname === "/dashboard/customer"}
        />

        <NavItem
          href="/track"
          icon={MapPin}
          label="Track Parcel"
          active={pathname?.startsWith("/track")}
        />
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

/* ---------------- NAV ITEM ---------------- */

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-xl
        text-sm font-medium transition
        ${
          active
            ? "bg-yellow-400 text-gray-900 shadow-md"
            : "text-gray-300 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      <Icon
        className={`w-5 h-5 ${
          active ? "text-gray-900" : ""
        }`}
      />
      {label}
    </Link>
  );
}
