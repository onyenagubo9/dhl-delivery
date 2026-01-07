"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  MapPin,
  Settings,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "View Orders",
    href: "/dashboard/admin/orders",
    icon: Package,
  },
  {
    name: "Riders",
    href: "/dashboard/admin/riders",
    icon: Truck,
  },
  {
    name: "Customers",
    href: "/dashboard/admin/customers",
    icon: Users,
  },
  {
    name: "Tracking",
    href: "/dashboard/admin/tracking",
    icon: MapPin,
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 text-xl font-bold border-b border-gray-800 text-yellow-400">
        🚚 Global Delivery
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
  );
}
