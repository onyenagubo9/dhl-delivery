"use client";

import { useState } from "react";

export default function SendTrackingMailPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ FULL FIXED HANDLER
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/send-tracking-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          trackingCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setMessage("✅ Email sent successfully");
      setEmail("");
      setName("");
      setTrackingCode("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">
        Send Tracking Email
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Tracking Code"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm">{message}</p>
      )}
    </div>
  );
}
