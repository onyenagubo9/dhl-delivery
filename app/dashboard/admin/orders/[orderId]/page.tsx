"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= TYPES ================= */

type Location = {
  lat: number;
  lng: number;
  address: string;
};

type TimelineItem = {
  id: string;
  status: string;
  message: string;
  timestamp: any;
};

type Order = {
  id: string;
  status: string;
  trackingNumber?: string;

  pickup: {
    contactName: string;
    phone: string;
    email: string;
    address: string;
  };

  recipient: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };

  tracking?: {
    currentLocation: Location;
    lastUpdated: any;
  };
};

/* ================= PAGE ================= */

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("in_transit");

  const [location, setLocation] = useState<Location>({
    lat: 0,
    lng: 0,
    address: "",
  });

  /* ---------- FETCH ORDER ---------- */
  async function fetchOrder() {
    const snap = await getDoc(doc(db, "orders", orderId));
    if (snap.exists()) {
      setOrder({ id: snap.id, ...(snap.data() as any) });
    }
  }

  /* ---------- FETCH TIMELINE ---------- */
  async function fetchTimeline() {
    const q = query(
      collection(db, "orders", orderId, "timeline"),
      orderBy("timestamp", "asc")
    );

    const snap = await getDocs(q);
    setTimeline(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    );
  }

  useEffect(() => {
    Promise.all([fetchOrder(), fetchTimeline()]).finally(() =>
      setLoading(false)
    );
  }, []);

  /* ---------- UPDATE STATUS ---------- */
  async function updateStatus() {
    if (!order) return;

    // 1️⃣ update order status
    await updateDoc(doc(db, "orders", order.id), {
      status,
      updatedAt: serverTimestamp(),
    });

    // 2️⃣ add timeline event (SUBCOLLECTION)
    await addDoc(collection(db, "orders", order.id, "timeline"), {
      status,
      message: `Order marked as ${status.replace("_", " ")}`,
      timestamp: serverTimestamp(),
    });

    alert("✅ Status updated");
    fetchOrder();
    fetchTimeline();
  }

  /* ---------- UPDATE LOCATION ---------- */
  async function updateLocation() {
    if (!order) return;

    if (!location.lat || !location.lng) {
      alert("Latitude and longitude required");
      return;
    }

    await updateDoc(doc(db, "orders", order.id), {
      tracking: {
        currentLocation: {
          lat: location.lat,
          lng: location.lng,
          address: location.address || "Unknown location",
        },
        lastUpdated: serverTimestamp(),
      },
    });

    alert("📍 Location updated");
    fetchOrder();
  }

  if (loading) return <p className="p-8">Loading…</p>;
  if (!order) return <p className="p-8">Order not found</p>;

  return (
    <main className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Order Details</h1>

      {/* ORDER INFO */}
      <Card title="Order Info">
        <Row label="Order ID" value={order.id} />
        <Row label="Status" value={order.status} />
        <Row label="Tracking" value={order.trackingNumber || "—"} />
      </Card>

      {/* UPDATE LOCATION */}
      <Card title="Update Live Location">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Latitude"
            className="input"
            onChange={(e) =>
              setLocation({ ...location, lat: Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Longitude"
            className="input"
            onChange={(e) =>
              setLocation({ ...location, lng: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Address"
            className="input"
            onChange={(e) =>
              setLocation({ ...location, address: e.target.value })
            }
          />
        </div>

        <button onClick={updateLocation} className="btn-yellow mt-4">
          Update Location
        </button>
      </Card>

      {/* UPDATE STATUS */}
      <Card title="Update Status">
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="assigned">Assigned</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>

        <button onClick={updateStatus} className="btn-yellow mt-4">
          Update Status
        </button>
      </Card>

      {/* TIMELINE */}
      <Card title="Tracking Timeline">
        <ol className="space-y-3">
          {timeline.map((t) => (
            <li key={t.id} className="border-l-4 border-yellow-400 pl-4">
              <p className="font-semibold">{t.status}</p>
              <p className="text-sm text-gray-600">{t.message}</p>
            </li>
          ))}
        </ol>
      </Card>
    </main>
  );
}

/* ================= UI ================= */

function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow border space-y-4">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
