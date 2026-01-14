"use client";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminChats() {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      orderBy("updatedAt", "desc")
    );

    return onSnapshot(q, snap => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Support Chats</h1>
      {chats.map(chat => (
        <Link
          key={chat.id}
          href={`/dashboard/admin/chats/${chat.id}`}
          className="block border p-3 rounded mb-2 hover:bg-gray-100"
        >
          Chat ID: {chat.id}
        </Link>
      ))}
    </div>
  );
}
