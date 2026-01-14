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
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import {
  Search,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setTimeline([]);

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "orders"),
        where("trackingNumber", "==", trackingNumber.trim())
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Tracking number not found");
        return;
      }

      const doc = snap.docs[0];
      const orderData = { id: doc.id, ...doc.data() };
      setOrder(orderData);

      // fetch timeline
      const timelineSnap = await getDocs(
        query(
          collection(db, "orders", doc.id, "timeline"),
          orderBy("timestamp", "asc")
        )
      );

      setTimeline(
        timelineSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      );
    } catch {
      setError("Failed to fetch tracking details");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-200 text-gray-700";
      case "assigned":
        return "bg-yellow-100 text-yellow-700";
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold">📦 Track Your Package</h1>
          <p className="text-slate-300">
            Enter your tracking number to see live delivery updates
          </p>
        </div>

        {/* SEARCH */}
        <form
          onSubmit={handleTrack}
          className="bg-white rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 flex items-center gap-2">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. TRK-1700000000"
              className="w-full outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl"
          >
            {loading ? "Tracking…" : "Track"}
          </button>
        </form>

        {error && (
          <p className="text-center text-red-400 font-semibold">
            {error}
          </p>
        )}

        {/* RESULTS */}
        {order && (
          <div className="space-y-8">

            {/* SUMMARY */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-sm text-gray-500">
                  Tracking:
                  <span className="ml-2 font-mono">
                    {order.trackingNumber}
                  </span>
                </p>

                <p className="text-sm">
                  Route:{" "}
                  <strong>
                    {order.pickup?.city}, {order.pickup?.country}
                  </strong>{" "}
                  →{" "}
                  <strong>
                    {order.recipient?.city}, {order.recipient?.country}
                  </strong>
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColor(
                  order.status
                )}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>

            {/* SENDER / RECEIVER */}
            <div className="grid md:grid-cols-2 gap-6">
              <PersonCard
                title="Sender"
                name={order.pickup?.name}
                phone={order.pickup?.phone}
                email={order.pickup?.email}
                address={order.pickup?.address}
              />

              <PersonCard
                title="Receiver"
                name={order.recipient?.name}
                phone={order.recipient?.phone}
                email={order.recipient?.email}
                address={order.recipient?.address}
              />
            </div>

            {/* PACKAGE */}
            <InfoCard title="Package Details" icon={Package}>
              <Row label="Goods Name" value={order.package?.goodsName} />
              <Row label="Category" value={order.package?.category} />
              <Row label="Description" value={order.package?.description} />
              <Row label="Weight" value={`${order.package?.weight} kg`} />
              <Row
                label="Dimensions"
                value={`${order.package?.length} x ${order.package?.width} x ${order.package?.height} cm`}
              />
              <Row label="Value" value={order.package?.value} />
            </InfoCard>

            {/* PAYMENT */}
            <InfoCard title="Payment" icon={CreditCard}>
              <Row label="Status" value={order.payment?.status} />
              <Row label="Method" value={order.payment?.method} />
              <Row label="Amount" value={`${order.payment?.currency} ${order.payment?.amount}`} />
            </InfoCard>

            {/* SCHEDULE */}
            <InfoCard title="Schedule" icon={Calendar}>
              <Row label="Pickup Date" value={order.pickupSchedule?.date} />
              <Row label="Pickup Time" value={order.pickupSchedule?.time} />
              <Row label="Delivery Date" value={order.deliverySchedule?.date} />
              <Row label="Delivery Time" value={order.deliverySchedule?.time} />
            </InfoCard>

            {/* CURRENT LOCATION */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-blue-500 animate-pulse" />
                <h2 className="font-bold text-lg">Current Location</h2>
              </div>

              <p className="text-sm text-gray-700">
                {order.tracking?.currentLocation?.address ||
                  "Location not updated yet"}
              </p>
            </div>

            {/* TIMELINE */}
            <TrackingTimeline history={timeline} />

            {/* MAP */}
            <TrackingMap
              location={order.tracking?.currentLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function PersonCard({ title, name, phone, email, address }: any) {
  return (
    <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <User className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>

      <Row label="Name" value={name} />
      <Row label="Phone" value={phone} />
      <Row label="Email" value={email} />
      <Row label="Address" value={address} />
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Icon className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm border-b pb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
