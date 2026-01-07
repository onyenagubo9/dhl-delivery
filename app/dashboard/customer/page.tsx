"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import CreateDeliveryModal from "@/components/dashboard/CreateDeliveryModal";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  Package,
  Truck,
  CheckCircle,
  Plus,
  Copy,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type Order = {
  id: string;
  pickupCity: string;
  pickupCountry: string;
  destinationCity: string;
  destinationCountry: string;
  status: string;
  trackingNumber?: string;
};

/* ---------------- PAGE ---------------- */

export default function CustomerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  async function fetchOrders() {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("customerId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const inTransit = orders.filter(
    (o) => o.status === "in_transit"
  ).length;
  const delivered = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  function statusBadge(status: string) {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold capitalize";

    switch (status) {
      case "assigned":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "in_transit":
        return `${base} bg-orange-100 text-orange-700`;
      case "delivered":
        return `${base} bg-green-100 text-green-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-100 via-gray-100 to-gray-200">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 space-y-8">
          {/* Header + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Deliveries
              </h1>
              <p className="text-sm text-gray-500">
                Manage and track your shipments
              </p>
            </div>

            {/* YELLOW PRIMARY BUTTON */}
            <button
              onClick={() => setOpenModal(true)}
              className="
                flex items-center gap-2
                bg-yellow-400 hover:bg-yellow-500
                text-gray-900
                px-5 py-2.5
                rounded-xl
                font-bold
                shadow-lg shadow-yellow-400/30
                transition-all
                hover:scale-[1.02]
              "
            >
              <Plus className="w-4 h-4" />
              Create Delivery
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Total Orders"
              value={totalOrders}
              icon={Package}
              variant="orders"
            />
            <StatCard
              title="In Transit"
              value={inTransit}
              icon={Truck}
              variant="transit"
            />
            <StatCard
              title="Delivered"
              value={delivered}
              icon={CheckCircle}
              variant="delivered"
            />
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border overflow-hidden">
            <div className="p-5 border-b font-semibold text-gray-800">
              Recent Orders
            </div>

            {loading ? (
              <p className="p-6 text-gray-500">
                Loading orders…
              </p>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No deliveries yet</p>
                <button
                  onClick={() => setOpenModal(true)}
                  className="mt-4 inline-flex items-center gap-2 text-yellow-600 font-bold hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Create your first delivery
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.pickupCity},{" "}
                        {order.pickupCountry} →{" "}
                        {order.destinationCity},{" "}
                        {order.destinationCountry}
                      </p>

                      {order.trackingNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span>
                            {order.trackingNumber}
                          </span>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                order.trackingNumber!
                              )
                            }
                            className="hover:text-gray-700"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={statusBadge(order.status)}
                      >
                        {order.status.replace("_", " ")}
                      </span>

                      {order.trackingNumber && (
                        <a
                          href={`/track/${order.trackingNumber}`}
                          className="text-yellow-600 text-sm font-bold hover:underline"
                        >
                          Track
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <CreateDeliveryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={fetchOrders}
      />
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({
  title,
  value,
  icon: Icon,
  variant,
}: {
  title: string;
  value: number;
  icon: any;
  variant: "orders" | "transit" | "delivered";
}) {
  const variants: any = {
    orders: "bg-red-50 text-red-600",
    transit: "bg-yellow-100 text-yellow-700",
    delivered: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-black/5 flex items-center gap-4 border">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${variants[variant]}`}
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
