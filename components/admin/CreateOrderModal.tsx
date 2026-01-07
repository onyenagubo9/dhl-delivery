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

    try {
      await addDoc(collection(db, "orders"), {
        status: "pending",
        createdAt: serverTimestamp(),

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
          description: form.get("packageDescription"),
          category: form.get("packageCategory"),
          weight: form.get("packageWeight"),
        },
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
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-yellow-500" />
            Create Order
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-8 overflow-y-auto max-h-[75vh]"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          {/* ---------------- PICKUP ---------------- */}
          <Section title="Sender (Pickup)">
            <Input name="pickupName" label="Name" />
            <Input name="pickupPhone" label="Phone" />
            <Input name="pickupEmail" label="Email" />
            <Input name="pickupAddress" label="Address" />
            <Input name="pickupCity" label="City" />
            <Input name="pickupCountry" label="Country" />
          </Section>

          {/* ---------------- RECEIVER ---------------- */}
          <Section title="Receiver">
            <Input name="recipientName" label="Name" />
            <Input name="recipientPhone" label="Phone" />
            <Input name="recipientEmail" label="Email" />
            <Input name="recipientAddress" label="Address" />
            <Input name="recipientCity" label="City" />
            <Input name="recipientCountry" label="Country" />
          </Section>

          {/* ---------------- PACKAGE ---------------- */}
          <Section title="Package">
            <Input name="packageDescription" label="Description" />
            <Input name="packageCategory" label="Category" />
            <Input
              name="packageWeight"
              label="Weight (kg)"
              type="number"
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
              className="
                bg-yellow-400 hover:bg-yellow-500
                text-black font-bold
                px-6 py-2
                rounded-lg
                flex items-center gap-2
              "
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        className="
          border rounded-lg px-3 py-2
          focus:ring-2 focus:ring-yellow-400
          outline-none
        "
      />
    </div>
  );
}
