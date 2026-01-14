"use client";

import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function UserChat() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  /* INIT CHAT AFTER AUTH READY */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const ref = doc(db, "chats", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setChatId(ref.id);
    });

    return () => unsub();
  }, []);

  /* LISTEN TO MESSAGES */
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chat_messages"),
      where("chatId", "==", chatId),
      orderBy("clientCreatedAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsub();
  }, [chatId]);

  /* SEND MESSAGE */
  const send = async () => {
    if (!text.trim() || !chatId) return;

    await addDoc(collection(db, "chat_messages"), {
      chatId,
      senderRole: "user",
      text,
      clientCreatedAt: Date.now(),
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "chats", chatId), {
      updatedAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div className="w-80 h-96 bg-white border rounded-xl shadow flex flex-col">
      <div className="bg-yellow-400 p-3 font-semibold">Support Chat</div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`px-3 py-2 rounded max-w-[70%] ${
              m.senderRole === "admin"
                ? "bg-gray-200"
                : "bg-red-600 text-white ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3"
          placeholder="Type message…"
        />
        <button onClick={send} className="bg-red-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
