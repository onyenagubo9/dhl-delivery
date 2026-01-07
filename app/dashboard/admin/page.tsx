"use client";

import { useEffect, useState } from "react";
import CreateRiderModal from "@/components/dashboard/CreateRiderModal";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Package,
  Users,
  Truck,
  Plus,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type Order = {
  id: string;
  status: string;
  pickup?: {
    country: string;
  };
  recipient?: {
    country: string;
  };
  trackingNumber?: string;
};

type Rider = {
  id: string;
  name: string;
  country: string;
  role: string;
};

/* ---------------- PAGE ---------------- */

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [openRiderModal, setOpenRiderModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH ORDERS -------- */
  async function fetchOrders() {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(
      snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }))
    );
  }

  /* -------- FETCH RIDERS -------- */
  async function fetchRiders() {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs
      .map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }))
      .filter((u) => u.role === "rider");

    setRiders(data);
  }

  useEffect(() => {
    Promise.all([fetchOrders(), fetchRiders()]).finally(
      () => setLoading(false)
    );
  }, []);

  /* -------- ASSIGN RIDER + TRACKING -------- */
  async function assignRider(orderId: string, riderId: string) {
    const trackingNumber =
      "GD-" +
      Math.random().toString(36).substring(2, 10).toUpperCase();

    await updateDoc(doc(db, "orders", orderId), {
      riderId,
      trackingNumber,
      status: "assigned",
      assignedAt: serverTimestamp(),
    });

    fetchOrders();
  }

  const totalOrders = orders.length;
  const totalRiders = riders.length;
  const activeOrders = orders.filter(
    (o) => o.status !== "delivered"
  ).length;

  if (loading) {
    return <p className="p-6">Loading admin dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <button
          onClick={() => setOpenRiderModal(true)}
          className="
            bg-red-600 hover:bg-red-700
            text-white
            px-5 py-2.5
            rounded-xl
            font-bold
            flex items-center gap-2
            shadow-lg
          "
        >
          <Plus className="w-4 h-4" />
          Create Rider
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={Package}
          color="yellow"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders}
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Total Riders"
          value={totalRiders}
          icon={Users}
          color="green"
        />
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border overflow-hidden">
        <div className="p-5 border-b font-semibold">
          Orders
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Tracking</th>
              <th className="p-3 text-left">Assign Rider</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-mono text-xs">
                  {o.id}
                </td>

                <td className="p-3">
                  {o.pickup?.country} →{" "}
                  {o.recipient?.country}
                </td>

                <td className="p-3">
                  <StatusBadge status={o.status} />
                </td>

                <td className="p-3 font-mono text-xs">
                  {o.trackingNumber || "—"}
                </td>

                <td className="p-3">
                  {o.status === "pending" ? (
                    <select
                      defaultValue=""
                      onChange={(e) =>
                        assignRider(o.id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="" disabled>
                        Assign rider
                      </option>
                      {riders.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.country})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-gray-400">
                      Assigned
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE RIDER MODAL */}
      <CreateRiderModal
        open={openRiderModal}
        onClose={() => setOpenRiderModal(false)}
        onCreated={fetchRiders}
      />
    </div>
  );
}

/* ---------------- UI ---------------- */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const map: any = {
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow border flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${map[color]}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    pending: "bg-gray-100 text-gray-700",
    assigned: "bg-yellow-100 text-yellow-700",
    in_transit: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
