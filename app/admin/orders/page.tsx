"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Eye,
  PackageCheck,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  RefreshCw,
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Calendar,
  X,
  ArrowRight,
  FileText,
  LogOut,
} from "lucide-react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  invoiceNumber?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  total: number;
  subtotal?: number;
  gst?: number;
  shipping: number;
  status: string;
  payment: string;
  paymentStatus: string;
  estimatedDelivery?: string;
  createdAt: string;
  items: string;
  orderItems?: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

const STATUS_FLOW = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  PLACED: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-600 text-white" },
  CONFIRMED: { bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-600 text-white" },
  PROCESSING: { bg: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-600 text-white" },
  SHIPPED: { bg: "bg-indigo-50", text: "text-indigo-700", badge: "bg-indigo-600 text-white" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-600 text-white" },
  CANCELLED: { bg: "bg-rose-50", text: "text-rose-700", badge: "bg-rose-600 text-white" },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 📦 Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔍 Filter & Search Effect
  useEffect(() => {
    let temp = [...orders];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      temp = temp.filter((o) => {
        const displayId = `ORD-${o.id.slice(-8).toUpperCase()}`;
        return (
          o.name.toLowerCase().includes(query) ||
          o.phone.includes(query) ||
          o.email.toLowerCase().includes(query) ||
          o.id.toLowerCase().includes(query) ||
          displayId.toLowerCase().includes(query) ||
          (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(query))
        );
      });
    }

    if (statusFilter !== "ALL") {
      temp = temp.filter((o) => o.status === statusFilter);
    }

    setFilteredOrders(temp);
  }, [searchTerm, statusFilter, orders]);

  // 🔄 Update Order Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // 💰 Update Payment Status
  const handleUpdatePaymentStatus = async (id: string, newPaymentStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((item) => (item.id === id ? { ...item, paymentStatus: newPaymentStatus } : item))
        );
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newPaymentStatus } : null));
        }
      } else {
        alert("Failed to update payment status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ❌ Cancel Order
  const handleCancelOrder = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/orders/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: "CANCELLED" } : item))
        );
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
        }
      } else {
        alert("Failed to cancel order");
      }
    } catch (error) {
      console.error(error);
      alert("Error cancelling order");
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper: Next Status in Flow
  const getNextStatus = (currentStatus: string) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1) {
      return STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  // Stats Counters
  const totalCount = orders.length;
  const placedCount = orders.filter((o) => o.status === "PLACED").length;
  const processingCount = orders.filter(
    (o) => o.status === "CONFIRMED" || o.status === "PROCESSING"
  ).length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-red-700 flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-red-700" />
              Order Management Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View, search, track, update status, and download invoices for customer orders.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition text-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Orders
            </button>
          </div>
        </div>

        {/* --- STATS OVERVIEW CARDS --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              statusFilter === "ALL"
                ? "bg-red-700 text-white border-red-700 shadow-md"
                : "bg-white border-slate-200 hover:border-red-300"
            }`}
          >
            <p className={`text-xs font-semibold ${statusFilter === "ALL" ? "text-red-100" : "text-slate-500"}`}>
              All Orders
            </p>
            <p className="text-2xl font-bold mt-1">{totalCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter("PLACED")}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              statusFilter === "PLACED"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white border-slate-200 hover:border-blue-300"
            }`}
          >
            <p className={`text-xs font-semibold ${statusFilter === "PLACED" ? "text-blue-100" : "text-slate-500"}`}>
              Placed
            </p>
            <p className="text-2xl font-bold mt-1">{placedCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter("PROCESSING")}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              statusFilter === "PROCESSING" || statusFilter === "CONFIRMED"
                ? "bg-amber-600 text-white border-amber-600 shadow-md"
                : "bg-white border-slate-200 hover:border-amber-300"
            }`}
          >
            <p className={`text-xs font-semibold ${statusFilter === "PROCESSING" ? "text-amber-100" : "text-slate-500"}`}>
              Processing
            </p>
            <p className="text-2xl font-bold mt-1">{processingCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter("SHIPPED")}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              statusFilter === "SHIPPED"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white border-slate-200 hover:border-indigo-300"
            }`}
          >
            <p className={`text-xs font-semibold ${statusFilter === "SHIPPED" ? "text-indigo-100" : "text-slate-500"}`}>
              Shipped
            </p>
            <p className="text-2xl font-bold mt-1">{shippedCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter("DELIVERED")}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              statusFilter === "DELIVERED"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-white border-slate-200 hover:border-emerald-300"
            }`}
          >
            <p className={`text-xs font-semibold ${statusFilter === "DELIVERED" ? "text-emerald-100" : "text-slate-500"}`}>
              Delivered
            </p>
            <p className="text-2xl font-bold mt-1">{deliveredCount}</p>
          </div>

          <div
            onClick={() => setStatusFilter("CANCELLED")}
            className={`cursor-pointer p-4 rounded-xl border transition ${
              statusFilter === "CANCELLED"
                ? "bg-rose-600 text-white border-rose-600 shadow-md"
                : "bg-white border-slate-200 hover:border-rose-300"
            }`}
          >
            <p className={`text-xs font-semibold ${statusFilter === "CANCELLED" ? "text-rose-100" : "text-slate-500"}`}>
              Cancelled
            </p>
            <p className="text-2xl font-bold mt-1">{cancelledCount}</p>
          </div>
        </div>

        {/* --- CONTROLS: SEARCH & FILTER --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, email, order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-red-600 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:border-red-600 focus:bg-white transition"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* --- ORDERS LIST / TABLE --- */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold text-lg">No orders found</p>
            <p className="text-slate-500 text-sm mt-1">Try matching another search term or status filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const displayOrderId = `ORD-${order.id.slice(-8).toUpperCase()}`;
              const parsedItems: OrderItem[] =
                typeof order.items === "string"
                  ? JSON.parse(order.items || "[]")
                  : order.items || [];
              const nextStatus = getNextStatus(order.status);
              const colorTheme = STATUS_COLORS[order.status] || STATUS_COLORS.PLACED;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row justify-between gap-6"
                >
                  {/* LEFT: Customer & Order Overview */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-slate-900 text-base">
                        {displayOrderId}
                      </span>
                      {order.invoiceNumber && (
                        <span className="text-xs bg-slate-100 font-mono text-slate-600 px-2.5 py-1 rounded-md">
                          {order.invoiceNumber}
                        </span>
                      )}
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${colorTheme.badge}`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto lg:ml-0">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" />
                          {order.name}
                        </p>
                        <p className="text-xs text-slate-500 pl-5">📞 {order.phone}</p>
                        <p className="text-xs text-slate-500 pl-5">✉️ {order.email}</p>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          Delivery Location
                        </p>
                        <p className="text-xs text-slate-500 pl-5 truncate max-w-xs">
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                          {order.state ? `, ${order.state}` : ""}
                          {order.pincode ? ` - ${order.pincode}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Products Preview */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <p className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                        Items ({parsedItems.reduce((acc, i) => acc + i.quantity, 0)})
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {parsedItems.map((item, idx) => (
                          <span key={idx} className="font-medium">
                            • {item.name} × {item.quantity} (₹{item.price})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Financial Summary & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 min-w-[220px]">
                    <div className="text-right w-full sm:w-auto">
                      <p className="text-xs text-slate-400">Total Amount</p>
                      <p className="text-2xl font-extrabold text-red-700">
                        ₹{order.total}
                      </p>
                      <div className="flex flex-col items-end gap-1 mt-1">
                        <p className="text-xs text-slate-500 font-medium">
                          Shipping: ₹{order.shipping}
                        </p>
                        <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                          order.payment?.toLowerCase().includes('cash') || order.payment?.toLowerCase() === 'cod' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          Pay Mode: {order.payment}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full justify-end">
                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>

                      {/* Download Invoice PDF */}
                      <a
                        href={`/api/admin/orders/${order.id}/invoice`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Invoice PDF
                      </a>

                      {/* Status Dropdown */}
                      {order.status !== "CANCELLED" && (
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="appearance-none flex items-center gap-1 pl-3 pr-8 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 outline-none cursor-pointer"
                          >
                            <option value="PLACED" className="bg-white text-slate-800">Placed</option>
                            <option value="CONFIRMED" className="bg-white text-slate-800">Confirmed</option>
                            <option value="PROCESSING" className="bg-white text-slate-800">Processing</option>
                            <option value="SHIPPED" className="bg-white text-slate-800">Shipped</option>
                            <option value="DELIVERED" className="bg-white text-slate-800">Delivered</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-white">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Cancel Button */}
                      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-medium transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- DETAILED ORDER MODAL --- */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">

              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">
                      Order Details: ORD-{selectedOrder.id.slice(-8).toUpperCase()}
                    </h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${STATUS_COLORS[selectedOrder.status]?.badge || 'bg-slate-700 text-white'}`}>
                      {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    Invoice No: {selectedOrder.invoiceNumber || "N/A"} | Date:{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

                {/* Status Progress Flow */}
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                    Order Processing Flow
                  </p>
                  {selectedOrder.status === "CANCELLED" ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5" /> Order Cancelled
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 text-center">
                      {STATUS_FLOW.map((step, idx) => {
                        const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status);
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                isCurrent
                                  ? "bg-red-700 text-white ring-4 ring-red-100"
                                  : isDone
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] mt-1.5 font-medium ${
                                isCurrent
                                  ? "text-red-700 font-bold"
                                  : isDone
                                  ? "text-emerald-700"
                                  : "text-slate-400"
                              }`}
                            >
                              {STATUS_LABELS[step]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Customer & Address Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Customer Details
                    </h3>
                    <p className="font-bold text-slate-900 text-sm">{selectedOrder.name}</p>
                    <p className="text-xs text-slate-600 mt-1">📞 {selectedOrder.phone}</p>
                    <p className="text-xs text-slate-600">✉️ {selectedOrder.email}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Delivery Address
                    </h3>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {selectedOrder.address}
                      {selectedOrder.city ? `, ${selectedOrder.city}` : ""}
                      {selectedOrder.state ? `, ${selectedOrder.state}` : ""}
                      {selectedOrder.pincode ? ` - ${selectedOrder.pincode}` : ""}
                    </p>
                    {selectedOrder.estimatedDelivery && (
                      <p className="text-xs text-emerald-700 font-bold mt-2 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedOrder.estimatedDelivery}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ordered Products Table */}
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                    Ordered Products
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3 text-center">Qty</th>
                          <th className="p-3 text-right">Price</th>
                          <th className="p-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(typeof selectedOrder.items === "string"
                          ? JSON.parse(selectedOrder.items || "[]")
                          : selectedOrder.items || []
                        ).map((item: OrderItem, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-800">{item.name}</td>
                            <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                            <td className="p-3 text-right text-slate-600">₹{item.price}</td>
                            <td className="p-3 text-right font-bold text-slate-800">
                              ₹{item.price * item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  {(() => {
                    const shipping = selectedOrder.shipping ?? 0;
                    const productTotal = selectedOrder.total - shipping;
                    const subtotal = selectedOrder.subtotal ?? Math.round(productTotal / 1.18);
                    const gst = selectedOrder.gst ?? Number((productTotal - subtotal).toFixed(2));
                    return (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>Product Subtotal</span>
                          <span className="font-semibold">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>GST (18% included)</span>
                          <span className="font-semibold">₹{gst}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Shipping Charge</span>
                          <span className="font-semibold">₹{shipping}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-900 font-extrabold text-sm">
                          <span>Total Amount</span>
                          <span className="text-red-700">₹{selectedOrder.total}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Quick Status Update Selector */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-amber-900">Change Order Status</p>
                      <p className="text-[11px] text-amber-700 mt-1">
                        Selecting a status will automatically trigger an email to the customer.
                      </p>
                    </div>

                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500 w-full mt-2"
                    >
                      <option value="PLACED">Placed</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Change Payment Status</p>
                      <div className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border inline-block ${
                          selectedOrder.payment?.toLowerCase().includes('cash') || selectedOrder.payment?.toLowerCase() === 'cod' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                        Mode: {selectedOrder.payment}
                      </div>
                    </div>

                    <select
                      value={selectedOrder.paymentStatus || "PENDING"}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value)}
                      className="bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 w-full mt-2"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="FAILED">Failed</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
                <a
                  href={`/api/admin/orders/${selectedOrder.id}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Download className="w-4 h-4" /> View / Download Invoice PDF
                </a>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}