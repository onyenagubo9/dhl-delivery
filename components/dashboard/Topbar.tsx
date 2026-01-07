"use client";

import { Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200 flex items-center justify-between px-6">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-900">
          Customer Dashboard
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />

          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>

          <span className="hidden sm:block text-sm font-medium text-gray-700">
            Account
          </span>
        </div>
      </div>
    </header>
  );
}
