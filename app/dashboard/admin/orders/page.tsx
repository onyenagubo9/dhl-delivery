"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus } from "lucide-react";
import CreateOrderModal from "@/components/admin/CreateOrderModal";

/* ---------------- TYPES ---------------- */

type Order = {
  id: string;
  status: string;
  pickup?: {
    country?: string;
  };
  recipient?: {
    country?: string;
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateOrder, setOpenCreateOrder] = useState(false);

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
      .map((d) => ({ id: d.id, ...(d.data() as any) }))
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

  if (loading) {
    return <p className="p-6">Loading orders…</p>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders
          </h1>
          <p className="text-sm text-gray-500">
            View and manage all customer deliveries
          </p>
        </div>

        {/* CREATE ORDER BUTTON */}
        <button
          onClick={() => setOpenCreateOrder(true)}
          className="
            bg-yellow-400 hover:bg-yellow-500
            text-black font-bold
            px-5 py-2.5
            rounded-xl
            flex items-center gap-2
            shadow-md
          "
        >
          <Plus className="w-4 h-4" />
          Create Order
        </button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="p-5 border-b font-semibold">
          All Orders
        </div>

        {orders.length === 0 ? (
          <p className="p-6 text-gray-500">
            No orders found.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Route</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Tracking</th>
                <th className="p-3 text-left">Details</th>
                <th className="p-3 text-left">Assign Rider</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-mono text-xs">
                    {o.id}
                  </td>

                  <td className="p-3">
                    {o.pickup?.country || "—"} →{" "}
                    {o.recipient?.country || "—"}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={o.status} />
                  </td>

                  <td className="p-3 font-mono text-xs">
                    {o.trackingNumber || "—"}
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/dashboard/admin/orders/${o.id}`}
                      className="text-yellow-600 font-semibold hover:underline"
                    >
                      View
                    </Link>
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
        )}
      </div>

      {/* CREATE ORDER MODAL */}
      <CreateOrderModal
        open={openCreateOrder}
        onClose={() => setOpenCreateOrder(false)}
        onCreated={fetchOrders}
      />
    </div>
  );
}

/* ---------------- UI ---------------- */

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
