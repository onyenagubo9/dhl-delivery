"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { createRiderAccount } from "@/lib/createRider";

export default function CreateRiderModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createRiderAccount(
        name,
        email,
        password,
        phone,
        country
      );
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create rider");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Create Rider Account
            </h2>
            <p className="text-sm text-gray-500">
              Add a new delivery rider to the system
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={name} onChange={setName} />
          <Input label="Email Address" type="email" value={email} onChange={setEmail} />
          <Input label="Phone Number" value={phone} onChange={setPhone} />
          <Input label="Country" value={country} onChange={setCountry} />
          <Input
            label="Temporary Password"
            type="password"
            value={password}
            onChange={setPassword}
          />

          {/* PRIMARY ACTION BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-2
              bg-yellow-400 hover:bg-yellow-500
              text-gray-900
              font-bold
              py-3 rounded-xl
              flex items-center justify-center gap-2
              shadow-lg shadow-yellow-400/30
              transition-all
              hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Creating Rider…" : "Create Rider"}
          </button>
        </form>

        {/* Footer hint */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Rider will receive login details via email
        </p>
      </div>
    </div>
  );
}

/* ---------- INPUT FIELD ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          border border-gray-300
          rounded-lg
          px-3 py-2.5
          focus:outline-none
          focus:ring-2 focus:ring-yellow-400
        "
      />
    </div>
  );
}
