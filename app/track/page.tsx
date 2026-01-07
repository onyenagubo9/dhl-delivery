"use client";

import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
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
} from "lucide-react";

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);

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
      setOrder({ id: doc.id, ...doc.data() });
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
          <h1 className="text-3xl font-extrabold tracking-tight">
            📦 Track Your Package
          </h1>
          <p className="text-slate-300">
            Enter your tracking number to see live delivery updates
          </p>
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleTrack}
          className="
            bg-white rounded-2xl shadow-xl p-4
            flex flex-col sm:flex-row gap-3
            transition hover:scale-[1.01]
          "
        >
          <div className="flex-1 flex items-center gap-2">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. GD-9A7FQX2L"
              className="w-full outline-none text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              bg-yellow-400 hover:bg-yellow-500
              text-black font-bold px-6 py-3 rounded-xl
              transition active:scale-95
            "
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
          <div className="space-y-8 animate-fade-in">

            {/* SUMMARY CARD */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-yellow-500" />
                  <h2 className="font-bold text-lg">
                    Shipment Summary
                  </h2>
                </div>

                <p className="text-sm text-gray-500">
                  Tracking No:
                  <span className="font-mono ml-2">
                    {order.trackingNumber}
                  </span>
                </p>

                <p className="text-sm">
                  Route:{" "}
                  <strong>
                    {order.pickup?.city},{" "}
                    {order.pickup?.country}
                  </strong>{" "}
                  →{" "}
                  <strong>
                    {order.recipient?.city},{" "}
                    {order.recipient?.country}
                  </strong>
                </p>
              </div>

              <span
                className={`self-start px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusColor(
                  order.status
                )}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>

            {/* SENDER & RECEIVER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersonCard
                title="Sender"
                name={order.pickup?.contactName}
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

            {/* CURRENT LOCATION */}
            <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-blue-500 animate-pulse" />
                <h2 className="font-bold text-lg">
                  Current Location
                </h2>
              </div>

              <p className="text-sm text-gray-700">
                {order.tracking?.currentLocation?.address ||
                  "Location not updated yet"}
              </p>
            </div>

            {/* TIMELINE */}
            <TrackingTimeline
              history={order.tracking?.history || []}
            />

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

function PersonCard({
  title,
  name,
  phone,
  email,
  address,
}: any) {
  return (
    <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <User className="w-5 h-5 text-yellow-500" />
        {title}
      </h3>

      <InfoRow icon={User} label="Name" value={name} />
      <InfoRow icon={Phone} label="Phone" value={phone} />
      <InfoRow icon={Mail} label="Email" value={email} />
      <InfoRow icon={MapPin} label="Address" value={address} />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-gray-500 w-20">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
