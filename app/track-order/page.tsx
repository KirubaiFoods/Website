"use client";

import { useState } from "react";
import {
  Search,
  PackageCheck,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Box,
  FileText,
} from "lucide-react";

const STEPS = [
  { key: "PLACED", label: "Order Placed", desc: "Order has been received by Kirubai Masala." },
  { key: "CONFIRMED", label: "Confirmed", desc: "Payment/order details successfully verified." },
  { key: "PROCESSING", label: "Processing", desc: "Your spices are being freshly packed." },
  { key: "SHIPPED", label: "Shipped", desc: "Handed over to courier for delivery." },
  { key: "DELIVERED", label: "Delivered", desc: "Package handed over to customer." },
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/track-order?id=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.ok && data) {
        setOrder(data);
      } else {
        setError(data.error || "Order not found. Please check your Order ID or Invoice Number.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tracking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey: string, orderStatus: string) => {
    if (orderStatus === "CANCELLED") return "CANCELLED";
    const statusOrder = ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentIdx = statusOrder.indexOf(orderStatus);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (stepIdx < currentIdx) return "COMPLETED";
    if (stepIdx === currentIdx) return "CURRENT";
    return "PENDING";
  };

  return (
    <main className="min-h-screen pt-40 pb-20 px-4 md:px-8 bg-slate-50 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1f4d3a] mb-3">
            Track Your Order
          </h1>
          <p className="text-slate-600 text-base">
            Enter your Order ID (e.g. ORD-XXXXXX) or Invoice Number to track live delivery status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 mb-8 border border-slate-200">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID or Invoice Number..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-slate-300 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-[#1f4d3a] focus:ring-2 focus:ring-[#1f4d3a]/20 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1f4d3a] hover:bg-[#17392b] transition text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-semibold disabled:opacity-50"
            >
              <Search size={20} />
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>

          {error && (
            <p className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Real Tracking Result */}
        {order && (
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-10 border border-slate-200 space-y-8 animate-in fade-in duration-300">

            {/* Header / Order Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Order Details
                </span>
                <h2 className="text-2xl font-bold text-[#1f4d3a] mt-0.5">
                  ORD-{order.id.slice(-8).toUpperCase()}
                </h2>
                {order.invoiceNumber && (
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Invoice: {order.invoiceNumber}
                  </p>
                )}
              </div>

              <div className="text-left md:text-right">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.status === "CANCELLED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {order.status}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Delivery Estimation Banner */}
            {order.estimatedDelivery && order.status !== "CANCELLED" && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-semibold">
                <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Estimated Delivery: {order.estimatedDelivery}</span>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Order Progress</h3>

              {order.status === "CANCELLED" ? (
                <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center text-rose-700 font-bold flex items-center justify-center gap-2">
                  <XCircle className="w-6 h-6" /> Order Cancelled
                </div>
              ) : (
                <div className="space-y-6">
                  {STEPS.map((step) => {
                    const status = getStepStatus(step.key, order.status);
                    const isDone = status === "COMPLETED";
                    const isCurrent = status === "CURRENT";

                    return (
                      <div key={step.key} className="flex gap-4 items-start">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold transition ${
                            isCurrent
                              ? "bg-[#1f4d3a] text-white ring-4 ring-emerald-100"
                              : isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isDone ? "✓" : isCurrent ? "•" : ""}
                        </div>

                        <div className="pt-1">
                          <h4
                            className={`font-bold text-base ${
                              isCurrent
                                ? "text-[#1f4d3a]"
                                : isDone
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Delivery Address & Customer Info */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">Customer</p>
                <p>{order.name}</p>
                <p>📞 {order.phone}</p>
                <p>✉️ {order.email}</p>
              </div>

              <div>
                <p className="font-bold text-slate-900 text-sm mb-1">Shipping Address</p>
                <p>
                  {order.address}
                  {order.city ? `, ${order.city}` : ""}
                  {order.state ? `, ${order.state}` : ""}
                  {order.pincode ? ` - ${order.pincode}` : ""}
                </p>
                <p className="mt-2 font-semibold text-slate-900">
                  Total Paid/COD: ₹{order.total}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}