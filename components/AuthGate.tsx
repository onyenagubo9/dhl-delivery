"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }
      setReady(true);
    });

    return unsub;
  }, []);

  if (!ready) {
    return (
      <div className="p-3 text-sm bg-white shadow rounded">
        Connecting to support…
      </div>
    );
  }

  return <>{children}</>;
}
