"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash, Package, Search, Image as ImageIcon, ShoppingBag, LogOut } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  weight: string;
  isActive: boolean;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    weight: "",
    isActive: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!editingProduct;
    const url = isEdit ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert("Failed to save product");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, image: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ name: "", description: "", price: "", image: "", category: "", stock: "", weight: "", isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      image: product.image || "",
      category: product.category || "",
      stock: product.stock.toString(),
      weight: product.weight || "",
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 text-black bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-red-600" /> Products Management
        </h1>
        <button onClick={openAddModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="outline-none w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-100 relative flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
                {!p.isActive && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-medium">Inactive</span>
                )}
              </div>
              <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-red-600 font-bold">₹{p.price}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Stock: {p.stock}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t divide-x">
                <button onClick={() => openEditModal(p)} className="p-3 text-sm text-blue-600 hover:bg-blue-50 flex justify-center items-center gap-2">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-3 text-sm text-red-600 hover:bg-red-50 flex justify-center items-center gap-2">
                  <Trash className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input required type="number" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="flex gap-2 items-center">
                  <input value={form.image} onChange={e=>setForm({...form, image: e.target.value})} className="flex-1 border p-2 rounded" placeholder="/products/image.png" />
                  <span className="text-gray-400 text-sm">OR</span>
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-2 rounded font-medium text-sm transition whitespace-nowrap">
                    {isUploading ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
                {form.image && (
                  <div className="mt-2 h-20 w-20 relative border rounded overflow-hidden">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (e.g. 100g)</label>
                  <input value={form.weight} onChange={e=>setForm({...form, weight: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" rows={3}></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form, isActive: e.target.checked})} id="isActive" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Visible on store)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
