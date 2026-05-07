"use client";

import { useState } from "react";
import { Search, PackageCheck, Truck, MapPin } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) return;

    setShowResult(true);
  };

  return (
    <main className="bg-[#f7f5f2] min-h-screen pt-40 pb-20 px-4 md:px-8">
      <div className="max-w-6xl ml-3 md:ml-12 lg:ml-20 mr-3 md:mr-6">

        {/* Heading */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-3xl font-bold text-[#1f1f1f] mb-4">
            Track Your Order
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-3xl">
            Enter your order ID below to check the current delivery status
            of your Kirubai Masala order.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-10 mb-12 border border-gray-100">
          <form
            onSubmit={handleTrack}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Enter your Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 text-lg outline-none focus:border-[#1f4d3a]"
            />

            <button
              type="submit"
              className="bg-[#1f4d3a] hover:bg-[#17392b] transition text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-medium"
            >
              <Search size={20} />
              Track Order
            </button>
          </form>
        </div>

        {/* Demo Tracking Result */}
        {showResult && (
          <div className="bg-white rounded-3xl shadow-md p-6 md:p-10 border border-gray-100">

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f4d3a] mb-2">
                Order Status
              </h2>

              <p className="text-gray-600">
                Tracking details for Order ID:
                <span className="font-semibold ml-2">{orderId}</span>
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-8">

              {/* Placed */}
              <div className="flex gap-4 items-start">
                <div className="bg-green-100 p-3 rounded-full">
                  <PackageCheck className="text-[#1f4d3a]" size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Order Confirmed
                  </h3>

                  <p className="text-gray-600">
                    Your order has been placed successfully.
                  </p>
                </div>
              </div>

              {/* Shipped */}
              <div className="flex gap-4 items-start">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Truck className="text-[#1f4d3a]" size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Shipped
                  </h3>

                  <p className="text-gray-600">
                    Your order is on the way to the delivery address.
                  </p>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="text-[#1f4d3a]" size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    Expected Delivery
                  </h3>

                  <p className="text-gray-600">
                    Estimated delivery within 2–5 business days.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}