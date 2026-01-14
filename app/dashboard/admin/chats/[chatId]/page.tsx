"use client";

import { use, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type PageProps = {
  params: Promise<{ chatId: string }>;
};

export default function AdminChat({ params }: PageProps) {
  // ✅ UNWRAP PARAMS (Next.js 16 FIX)
  const { chatId } = use(params);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  /* LISTEN TO MESSAGES */
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chat_messages"),
      where("chatId", "==", chatId),
      orderBy("clientCreatedAt", "asc")
    );

    return onSnapshot(q, (snap) => {
      const safe = snap.docs
        .map((d) => d.data())
        .filter((m) => m.text && m.senderRole);

      setMessages(safe);
    });
  }, [chatId]);

  /* SEND MESSAGE */
  const send = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chat_messages"), {
      chatId,
      senderRole: "admin",
      text,
      clientCreatedAt: Date.now(),
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div>
      <h2 className="font-bold mb-3">Support Chat</h2>

      <div className="h-[70vh] overflow-y-auto space-y-2 border p-3 rounded">
        {messages.map((m, i) => (
          <div key={i} className="p-2 bg-gray-100 rounded">
            <strong>{m.senderRole}</strong>: {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Reply to user..."
        />
        <button
          onClick={send}
          className="bg-black text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
