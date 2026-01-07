"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  MapPin,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
  { name: "View Orders", href: "/dashboard/admin/orders", icon: Package },
  { name: "Riders", href: "/dashboard/admin/riders", icon: Truck },
  { name: "Customers", href: "/dashboard/admin/customers", icon: Users },
  { name: "Tracking", href: "/dashboard/admin/tracking", icon: MapPin },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 text-white shadow">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-semibold text-yellow-400">🚚 Global Delivery</span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 inset-y-0 left-0 w-64
          bg-gray-900 text-gray-200 flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 text-xl font-bold border-b border-gray-800 text-yellow-400 flex justify-between items-center">
          🚚 Global Delivery
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ name, href, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <Link
                key={name}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${
                    active
                      ? "bg-yellow-400 text-gray-900 font-semibold shadow"
                      : "hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 text-xs text-gray-400 border-t border-gray-800">
          Admin Panel
        </div>
      </aside>
    </>
  );
}
