"use client";

import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function track() {
    setError("");

    const q = query(
      collection(db, "orders"),
      where("trackingNumber", "==", trackingNumber)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setError("❌ Tracking number not found");
      return;
    }

    const docRef = snap.docs[0];
    setOrder({ id: docRef.id, ...docRef.data() });

    const timelineSnap = await getDocs(
      query(
        collection(db, "orders", docRef.id, "timeline"),
        orderBy("timestamp", "asc")
      )
    );

    setTimeline(timelineSnap.docs.map((d) => d.data()));
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Track Your Shipment</h1>

      <div className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button onClick={track} className="btn-yellow">
          Track
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {order && (
        <>
          <div className="card">
            <p>Status: {order.status}</p>
            <p>
              From: {order.pickup.address} → {order.recipient.address}
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Timeline</h3>
            <ul className="space-y-2">
              {timeline.map((t, i) => (
                <li key={i}>
                  <b>{t.status}</b> — {t.message}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
