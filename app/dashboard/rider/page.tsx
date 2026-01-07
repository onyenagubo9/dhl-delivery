"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Order = {
  id: string;
  pickupCountry: string;
  pickupCity: string;
  destinationCountry: string;
  destinationCity: string;
  status: string;
};

export default function RiderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "orders"),
      where("riderId", "==", auth.currentUser.uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    setOrders(data);
    setLoading(false);
  }

  // Update order status
  async function updateStatus(orderId: string, status: string) {
    await updateDoc(doc(db, "orders", orderId), {
      status,
    });

    // If delivered, free rider
    if (status === "delivered" && auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        isAvailable: true,
      });
    }

    fetchOrders();
  }

  // Send live location
  async function sendLocation(orderId: string) {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      await setDoc(
        doc(db, "tracking", orderId),
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Location updated");
    });
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-6">Loading rider dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rider Dashboard</h1>

      {orders.length === 0 ? (
        <p>No assigned deliveries</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-lg"
            >
              <p>
                <strong>From:</strong> {order.pickupCity},{" "}
                {order.pickupCountry}
              </p>
              <p>
                <strong>To:</strong> {order.destinationCity},{" "}
                {order.destinationCountry}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">
                  {order.status}
                </span>
              </p>

              <div className="flex gap-3 mt-4 flex-wrap">
                {order.status === "assigned" && (
                  <button
                    onClick={() =>
                      updateStatus(order.id, "in_transit")
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Start Delivery
                  </button>
                )}

                {order.status === "in_transit" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(order.id, "delivered")
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Mark Delivered
                    </button>

                    <button
                      onClick={() => sendLocation(order.id)}
                      className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                      Send Location
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
