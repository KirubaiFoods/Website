"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <section className="relative w-full mt-[150px] h-[400px] overflow-hidden bg-black">
        <Image
          src="/Whole-Spices.png"
          alt="Spices Background"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center select-none"
        />
      </section>

      {/* HEADING */}
      <section className="relative pt-16 pb-10 px-6 overflow-hidden">

        <h2 className="absolute top-0 left-1/2 -translate-x-1/2 text-[90px] md:text-[150px] font-extrabold uppercase tracking-tight text-black/[0.04] whitespace-nowrap pointer-events-none select-none leading-none">
          Products
        </h2>

        <div className="relative z-10 text-center pt-3">
          <h3 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-[#555] leading-none">
            Our Products
          </h3>
        </div>

        {/* CATEGORY TABS */}
        <div className="relative z-7 mt-12 flex flex-wrap justify-center gap-3">

          {[
            "All",
            "Pure Spices",
            "Spice Blends",
            "Pantry",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setActiveCategory(item)}
              className={`px-7 py-3 font-bold text-base shadow-md transition-all duration-300 ${
                activeCategory === item
                  ? "bg-[#f59e0b] text-white"
                  : "bg-white text-black hover:bg-[#f59e0b] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-13 border-b border-gray-300"></div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="pt-2 pb-10 px-4 max-w-7xl mx-auto min-h-[400px]">

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#f59e0b]"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
          </div>
        )}

      </section>

      {/* QUICK VIEW */}
      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  );
}

/* ===========================
   PRODUCT CARD COMPONENT
=========================== */

function ProductCard({ product, addToCart, setSelectedProduct }: any) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name + (product.weight ? " (" + product.weight + ")" : ""),
      price: product.price,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition p-4 group relative flex flex-col">

      <div className="relative group overflow-hidden rounded-lg mb-4 h-48 flex items-center justify-center bg-gray-50">
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 z-10"></div>
        {product.image ? (
          <img
            src={product.image}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl">🛒</span>
        )}

        <button
          onClick={() => setSelectedProduct(product)}
          className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 z-20 cursor-pointer"
        >
          👁
        </button>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-2 text-red-700">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <p className="text-black font-bold text-lg">
            ₹ {product.price}
          </p>
          {product.weight && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {product.weight}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`mt-4 w-full py-2 rounded-full font-medium transition cursor-pointer ${isAdded ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
      >
        {isAdded ? "Added to Cart ✔" : "Add To Cart"}
      </button>
    </div>
  );
}

/* ===========================
   QUICK VIEW MODAL
=========================== */
function QuickView({ product, onClose, addToCart }: any) {
  const [qty, setQty] = useState(1);
  const router = useRouter();
function getDeliveryDates() {
  const today = new Date();

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 3);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 5);

  const options: any = { day: "numeric", month: "long" };

  return {
    min: minDate.toLocaleDateString("en-IN", options),
    max: maxDate.toLocaleDateString("en-IN", options),
  };
}
const { min, max } = getDeliveryDates();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-4xl relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-black font-bold"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Image */}
          <img
            src={product.image}
            className="w-full rounded-lg"
          />

          {/* Details */}
          <div>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-2 text-red-700">
              {product.name}
            </h2>

            {/* Price */}
            <p className="text-red-700 font-bold text-2xl mb-2">
              ₹ {product.price}
            </p>

            {/* Shipping */}
            <p className="text-sm text-gray-700 mb-4">
              Shipping calculated at checkout.
            </p>
           <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
  <span className="text-lg">🚚</span>
  <span className="text-sm">
    Arrives in <strong className="text-blue-900">3-5 days</strong> within Tamil Nadu.
  </span>
</div>

            {/* Weight */}
            <div className="mb-4">
              <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full border border-gray-300">
                {product.weight || "1 Pcs"}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 border border-gray-400 rounded text-black font-bold"
              >
                −
              </button>

              <span className="text-black font-semibold text-lg">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 border border-gray-400 rounded text-black font-bold"
              >
                +
              </button>

            </div>

            {/* Add to cart */}
            <button
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name + (product.weight ? " (" + product.weight + ")" : ""),
                  price: product.price,
                  image: product.image,
                  quantity: qty,
                });
                
                // Show a brief alert or toast (using native alert for simplicity if desired, or just close)
                onClose();
                alert(`Added ${qty} ${product.name} to cart!`);
              }}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-full mb-3 cursor-pointer"
            >
              Add to cart
            </button>

            {/* Buy Now */}
            <button
  onClick={() => {
    addToCart({
      id: product.id,
      name: product.name + (product.weight ? " (" + product.weight + ")" : ""),
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    onClose(); // close modal

    router.push("/checkout"); // go to checkout
  }}
  className="w-full border border-gray-400 text-black py-3 rounded-full hover:bg-gray-100 transition"
>
  Buy It Now
</button>

          </div>
        </div>

      </div>
    </div>
  );
}
