"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function CreateDeliveryModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  /* ---------------- PICKUP (SENDER) ---------------- */
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [pickupCountry, setPickupCountry] = useState("");
  const [pickupName, setPickupName] = useState("");
  const [pickupPhone, setPickupPhone] = useState("");
  const [pickupEmail, setPickupEmail] = useState("");

  /* ---------------- RECIPIENT ---------------- */
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");

  /* ---------------- PACKAGE ---------------- */
  const [packageDescription, setPackageDescription] = useState("");
  const [packageCategory, setPackageCategory] = useState("parcel");
  const [packageWeight, setPackageWeight] = useState("");

  /* ---------------- DELIVERY ---------------- */
  const [deliveryType, setDeliveryType] = useState("standard");
  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);

    await addDoc(collection(db, "orders"), {
      customerId: auth.currentUser.uid,
      status: "pending",

      pickup: {
        address: pickupAddress,
        city: pickupCity,
        country: pickupCountry,
        contactName: pickupName,
        phone: pickupPhone,
        email: pickupEmail,
      },

      recipient: {
        name: recipientName,
        phone: recipientPhone,
        email: recipientEmail,
        address: recipientAddress,
        city: destinationCity,
        country: destinationCountry,
      },

      package: {
        description: packageDescription,
        category: packageCategory,
        weight: Number(packageWeight),
      },

      deliveryType,
      instructions,
      createdAt: serverTimestamp(),
    });

    setLoading(false);
    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Create Delivery
            </h2>
            <p className="text-sm text-gray-500">
              Enter pickup, recipient, and package details
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PICKUP */}
          <Section title="Pickup (Sender) Information">
            <Input label="Pickup Address" value={pickupAddress} onChange={setPickupAddress} />
            <TwoCol>
              <Input label="City" value={pickupCity} onChange={setPickupCity} />
              <Input label="Country" value={pickupCountry} onChange={setPickupCountry} />
            </TwoCol>
            <TwoCol>
              <Input label="Contact Name" value={pickupName} onChange={setPickupName} />
              <Input label="Phone Number" value={pickupPhone} onChange={setPickupPhone} />
            </TwoCol>
            <Input
              label="Email Address"
              type="email"
              value={pickupEmail}
              onChange={setPickupEmail}
            />
          </Section>

          {/* RECIPIENT */}
          <Section title="Recipient Information">
            <Input label="Recipient Name" value={recipientName} onChange={setRecipientName} />
            <Input label="Recipient Address" value={recipientAddress} onChange={setRecipientAddress} />
            <TwoCol>
              <Input label="City" value={destinationCity} onChange={setDestinationCity} />
              <Input label="Country" value={destinationCountry} onChange={setDestinationCountry} />
            </TwoCol>
            <TwoCol>
              <Input label="Recipient Phone" value={recipientPhone} onChange={setRecipientPhone} />
              <Input
                label="Recipient Email"
                type="email"
                value={recipientEmail}
                onChange={setRecipientEmail}
              />
            </TwoCol>
          </Section>

          {/* PACKAGE */}
          <Section title="Package Details">
            <Input label="Package Description" value={packageDescription} onChange={setPackageDescription} />
            <TwoCol>
              <select
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
                value={packageCategory}
                onChange={(e) => setPackageCategory(e.target.value)}
              >
                <option value="documents">Documents</option>
                <option value="parcel">Parcel</option>
                <option value="fragile">Fragile</option>
              </select>

              <Input
                label="Weight (kg)"
                type="number"
                value={packageWeight}
                onChange={setPackageWeight}
              />
            </TwoCol>
          </Section>

          {/* DELIVERY */}
          <Section title="Delivery Preferences">
            <select
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
            </select>

            <textarea
              className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400"
              placeholder="Special instructions (optional)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </Section>

          {/* SUBMIT BUTTON (YELLOW PRIMARY) */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-yellow-400 hover:bg-yellow-500
              text-gray-900
              py-3 rounded-xl
              font-bold
              flex items-center justify-center gap-2
              shadow-lg shadow-yellow-400/30
              transition-all
              hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <Send className="w-5 h-5" />
            {loading ? "Creating Delivery…" : "Create Delivery"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Delivery will be reviewed and assigned by admin
          </p>
        </form>
      </div>
    </div>
  );
}

/* ---------------- SMALL UI COMPONENTS ---------------- */

function Section({ title, children }: any) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TwoCol({ children }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}
