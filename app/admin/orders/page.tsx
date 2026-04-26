"use client";

import { useEffect, useState } from "react";


type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // 📦 Fetch Orders
  const fetchOrders = async () => {
  const res = await fetch("/api/admin/orders");
  const data = await res.json();

  setOrders(data);
  setFilteredOrders(data); // ✅ important
};

  // 🔄 Update Status
  const updateStatus = async (id: string, status: string) => {
  try {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Status updated ✅");

      // 🔄 Refresh orders
      fetchOrders(); // make sure you already have this
    } else {
      alert("Failed to update");
    }
  } catch (error) {
    console.error(error);
    alert("Error updating status");
  }
};

  // ❌ Cancel Order
  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch("/api/admin/orders/cancel", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        return;
      }

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };
  
const [filteredOrders, setFilteredOrders] = useState([]);

const [statusFilter, setStatusFilter] = useState("ALL");
const [searchTerm, setSearchTerm] = useState("");
useEffect(() => {
  fetchOrders();
}, []);
useEffect(() => {
  let temp: any = [...orders];

  // 🔍 SEARCH
  if (searchTerm) {
    temp = temp.filter((order: any) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm)
    );
  }

  // 📦 FILTER
  if (statusFilter !== "ALL") {
    temp = temp.filter((order: any) => order.status === statusFilter);
  }

  setFilteredOrders(temp);
}, [searchTerm, statusFilter, orders]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
        Orders Dashboard
      </h1>

      <p className="text-center text-gray-600 mb-6">
        Manage and track all customer orders
      </p>

      {/* Empty State */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

  {/* 🔍 SEARCH */}
  <input
    type="text"
    placeholder="Search by name or phone..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-2 rounded w-full md:w-1/2"
  />

  {/* 📦 FILTER */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-2 rounded w-full md:w-1/4"
  >
    <option value="ALL">All Orders</option>
    <option value="PLACED">Placed</option>
    <option value="SHIPPED">Shipped</option>
    <option value="DELIVERED">Delivered</option>
    <option value="CANCELLED">Cancelled</option>
  </select>

</div>
      {filteredOrders.length === 0 ? (
        
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        filteredOrders.map((order: any) => {
  const parsedItems = JSON.parse(order.items || "[]");

  return (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold text-red-600">
                  {order.name}
                </h2>

                <p className="text-gray-700">📞 {order.phone}</p>
                <p className="text-gray-700">📍 {order.address}</p>
                <div className="mt-2">
  <p className="font-semibold text-black">Items:</p>

  {parsedItems.map((item: any, index: number) => (
    <div key={index} className="text-sm text-gray-700 ml-2">
      • {item.name} × {item.quantity} — ₹{item.price}
    </div>
  ))}
</div>

<p className="text-sm text-black font-semibold mt-2">
  Total: ₹{order.total}
</p>

<p className="text-sm text-black">
  Payment: {order.payment}
</p>

                {/* Status */}
                <span
                  className={`inline-block mt-2 px-3 py-1 text-white rounded ${
                    order.status === "PLACED"
                      ? "bg-blue-500"
                      : order.status === "CANCELLED"
                      ? "bg-red-500"
                      : order.status === "DELIVERED"
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* RIGHT BUTTONS */}
              <div className="flex gap-2">
                {/* Update */}
                {order.status !== "DELIVERED" && (
                  <button
                    onClick={() => {
  let newStatus = order.status;

  if (order.status === "PLACED") newStatus = "SHIPPED";
  else if (order.status === "SHIPPED") newStatus = "DELIVERED";

  updateStatus(order.id, newStatus);
}}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                )}

                {/* Cancel */}
                {order.status !== "CANCELLED" && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Date */}
            <p className="text-sm text-gray-500 mt-3">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        );
})
      )}
    </div>
  );
}