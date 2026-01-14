"use client";

import { useState } from "react";
import UserChat from "@/components/chat/UserChat";
import AuthGate from "@/components/AuthGate";
import { MessageCircle, X } from "lucide-react";

export default function LandingChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-full shadow"
      >
        <MessageCircle size={18} />
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"
          >
            <X size={14} />
          </button>

          <AuthGate>
            <UserChat />
          </AuthGate>
        </div>
      )}
    </>
  );
}
