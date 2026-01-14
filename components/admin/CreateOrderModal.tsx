"use client";

import { useState } from "react";
import { X, PackagePlus } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateOrderModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const trackingNumber = "TRK-" + Date.now();

    try {
      await addDoc(collection(db, "orders"), {
        trackingNumber,
        status: "pending",

        priority: form.get("priority"),
        fragile: form.get("fragile") === "on",
        insured: form.get("insured") === "on",
        insuranceAmount: Number(form.get("insuranceAmount")) || 0,

        payment: {
          status: "unpaid",
          method: form.get("paymentMethod"),
          currency: form.get("currency"),
          amount: Number(form.get("amount")),
        },

        pickupSchedule: {
          date: form.get("pickupDate"),
          time: form.get("pickupTime"),
          instructions: form.get("pickupInstructions"),
        },

        deliverySchedule: {
          date: form.get("deliveryDate"),
          time: form.get("deliveryTime"),
          instructions: form.get("deliveryInstructions"),
          signatureRequired: form.get("signatureRequired") === "on",
        },

        pickup: {
          name: form.get("pickupName"),
          phone: form.get("pickupPhone"),
          email: form.get("pickupEmail"),
          address: form.get("pickupAddress"),
          city: form.get("pickupCity"),
          country: form.get("pickupCountry"),
        },

        recipient: {
          name: form.get("recipientName"),
          phone: form.get("recipientPhone"),
          email: form.get("recipientEmail"),
          address: form.get("recipientAddress"),
          city: form.get("recipientCity"),
          country: form.get("recipientCountry"),
        },

        package: {
          goodsName: form.get("goodsName"),
          description: form.get("packageDescription"),
          category: form.get("packageCategory"),
          weight: Number(form.get("packageWeight")),
          length: Number(form.get("packageLength")),
          width: Number(form.get("packageWidth")),
          height: Number(form.get("packageHeight")),
          value: Number(form.get("packageValue")),
          hazardous: form.get("hazardous") === "on",
        },

        notes: form.get("notes"),

        createdAt: serverTimestamp(),
      });

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-yellow-500" />
            Create Logistics Order
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-10 overflow-y-auto max-h-[75vh]"
        >

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          {/* ORDER SETTINGS */}
          <Section title="Order Settings">
            <Select name="priority" label="Priority" options={["Normal", "High", "Urgent"]} />
            <Checkbox name="fragile" label="Fragile" />
            <Checkbox name="insured" label="Insured" />
            <Input name="insuranceAmount" label="Insurance Amount" type="number" />
          </Section>

          {/* PAYMENT */}
          <Section title="Payment">
            <Select name="paymentMethod" label="Payment Method" options={["Card", "Transfer", "Cash", "Crypto"]} />
            <Select name="currency" label="Currency" options={["USD", "EUR", "GBP"]} />
            <Input name="amount" label="Total Amount" type="number" />
          </Section>

          {/* PICKUP SCHEDULE */}
          <Section title="Pickup Schedule">
            <Input name="pickupDate" label="Pickup Date" type="date" />
            <Input name="pickupTime" label="Pickup Time" type="time" />
            <Input name="pickupInstructions" label="Pickup Instructions" />
          </Section>

          {/* DELIVERY SCHEDULE */}
          <Section title="Delivery Schedule">
            <Input name="deliveryDate" label="Delivery Date" type="date" />
            <Input name="deliveryTime" label="Delivery Time" type="time" />
            <Input name="deliveryInstructions" label="Delivery Instructions" />
            <Checkbox name="signatureRequired" label="Signature Required" />
          </Section>

          {/* PICKUP */}
          <Section title="Sender (Pickup)">
            <Input name="pickupName" label="Name" />
            <Input name="pickupPhone" label="Phone" />
            <Input name="pickupEmail" label="Email" />
            <Input name="pickupAddress" label="Address" />
            <Input name="pickupCity" label="City" />
            <Input name="pickupCountry" label="Country" />
          </Section>

          {/* RECEIVER */}
          <Section title="Receiver">
            <Input name="recipientName" label="Name" />
            <Input name="recipientPhone" label="Phone" />
            <Input name="recipientEmail" label="Email" />
            <Input name="recipientAddress" label="Address" />
            <Input name="recipientCity" label="City" />
            <Input name="recipientCountry" label="Country" />
          </Section>

          {/* PACKAGE */}
          <Section title="Package Details">
            <Input name="goodsName" label="Goods Name" />
            <Input name="packageDescription" label="Description" />
            <Input name="packageCategory" label="Category" />
            <Input name="packageWeight" label="Weight (kg)" type="number" />
            <Input name="packageLength" label="Length (cm)" type="number" />
            <Input name="packageWidth" label="Width (cm)" type="number" />
            <Input name="packageHeight" label="Height (cm)" type="number" />
            <Input name="packageValue" label="Declared Value" type="number" />
            <Checkbox name="hazardous" label="Hazardous Material" />
          </Section>

          {/* NOTES */}
          <Section title="Additional Notes">
            <textarea
              name="notes"
              className="border rounded-lg p-3 w-full h-24 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Extra instructions or comments..."
            />
          </Section>

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg"
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, name, type = "text" }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        required
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
      />
    </div>
  );
}

function Select({ label, name, options }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        name={name}
        required
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ name, label }: any) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} className="accent-yellow-500" />
      {label}
    </label>
  );
}
