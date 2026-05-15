"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const products = [
    // PURE SPICES
    {
      id: 1,
      category: "Pure Spices",
      name: "Turmeric Powder",
      image: "/turmeric.jpg",
      mrp: 150,
      weights: [
        { label: "200g", price: 120 },
        { label: "500g", price: 260 },
        { label: "1kg", price: 480 },
      ],
    },
    {
      id: 2,
      category: "Pure Spices",
      name: "Chilli Powder",
      image: "/chilli.jpg",
      mrp: 170,
      weights: [
        { label: "200g", price: 140 },
        { label: "500g", price: 320 },
        { label: "1kg", price: 620 },
      ],
    },
    {
      id: 3,
      category: "Pure Spices",
      name: "Coriander Powder",
      image: "/coriander.jpg",
      mrp: 140,
      weights: [
        { label: "200g", price: 120 },
        { label: "500g", price: 270 },
        { label: "1kg", price: 500 },
      ],
    },
    {
      id: 4,
      category: "Pure Spices",
      name: "Pepper",
      image: "/pepper.jpg",
      mrp: 250,
      weights: [
        { label: "100g", price: 180 },
        { label: "250g", price: 420 },
        { label: "500g", price: 780 },
      ],
    },

    // SPICE BLENDS
    {
      id: 5,
      category: "Spice Blends",
      name: "Sambar Powder",
      image: "/sambar.webp",
      mrp: 140,
      weights: [
        { label: "200g", price: 120 },
        { label: "500g", price: 280 },
        { label: "1kg", price: 520 },
      ],
    },
    {
      id: 6,
      category: "Spice Blends",
      name: "Garam Masala",
      image: "/garam.jpg",
      mrp: 180,
      weights: [
        { label: "100g", price: 140 },
        { label: "250g", price: 320 },
        { label: "500g", price: 580 },
      ],
    },
    {
      id: 7,
      category: "Spice Blends",
      name: "Chicken 65 Masala",
      image: "/chicken65.jpg",
      mrp: 180,
      weights: [
        { label: "100g", price: 150 },
        { label: "250g", price: 340 },
        { label: "500g", price: 620 },
      ],
    },
    {
      id: 8,
      category: "Spice Blends",
      name: "Mutton Masala",
      image: "/mutton.jpg",
      mrp: 200,
      weights: [
        { label: "100g", price: 160 },
        { label: "250g", price: 360 },
        { label: "500g", price: 680 },
      ],
    },
    {
      id: 9,
      category: "Spice Blends",
      name: "Chicken Masala",
      image: "/chicken.jpg",
      mrp: 180,
      weights: [
        { label: "200g", price: 150 },
        { label: "500g", price: 350 },
        { label: "1kg", price: 650 },
      ],
    },
    {
      id: 10,
      category: "Spice Blends",
      name: "Idli Podi",
      image: "/idlipodi.jpg",
      mrp: 150,
      weights: [
        { label: "200g", price: 120 },
        { label: "500g", price: 280 },
        { label: "1kg", price: 520 },
      ],
    },

    // PANTRY
    {
      id: 11,
      category: "Pantry",
      name: "Fried Gram",
      image: "/friedgram.jpg",
      mrp: 90,
      weights: [
        { label: "250g", price: 70 },
        { label: "500g", price: 130 },
        { label: "1kg", price: 240 },
      ],
    },
    {
      id: 12,
      category: "Pantry",
      name: "Mustard Seeds",
      image: "/mustard.jpg",
      mrp: 70,
      weights: [
        { label: "100g", price: 40 },
        { label: "250g", price: 90 },
        { label: "500g", price: 160 },
      ],
    },
    {
      id: 13,
      category: "Pantry",
      name: "Atta",
      image: "/atta.jpg",
      mrp: 80,
      weights: [
        { label: "1kg", price: 65 },
        { label: "5kg", price: 310 },
        { label: "10kg", price: 600 },
      ],
    },
    {
      id: 14,
      category: "Pantry",
      name: "Maida",
      image: "/maida.jpg",
      mrp: 70,
      weights: [
        { label: "1kg", price: 55 },
        { label: "5kg", price: 260 },
        { label: "10kg", price: 500 },
      ],
    },
    {
      id: 15,
      category: "Pantry",
      name: "Corn Flour",
      image: "/cornflour.jpg",
      mrp: 90,
      weights: [
        { label: "250g", price: 60 },
        { label: "500g", price: 110 },
        { label: "1kg", price: 200 },
      ],
    },
    {
      id: 16,
      category: "Pantry",
      name: "Rava",
      image: "/rava.jpg",
      mrp: 75,
      weights: [
        { label: "500g", price: 50 },
        { label: "1kg", price: 95 },
        { label: "5kg", price: 450 },
      ],
    },
    {
      id: 17,
      category: "Pantry",
      name: "Peanuts",
      image: "/peanuts.jpg",
      mrp: 120,
      weights: [
        { label: "250g", price: 90 },
        { label: "500g", price: 170 },
        { label: "1kg", price: 320 },
      ],
    },
    {
      id: 18,
      category: "Pantry",
      name: "Gram Flour",
      image: "/gramflour.jpg",
      mrp: 90,
      weights: [
        { label: "500g", price: 70 },
        { label: "1kg", price: 130 },
        { label: "5kg", price: 620 },
      ],
    },
  ];

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
      <section className="pt-2 pb-10 px-4 max-w-7xl mx-auto">

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
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0]);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition p-4 group relative">

      <div className="relative group overflow-hidden rounded-lg mb-4">

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>

        <img
          src={product.image}
          className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <button
          onClick={() => setSelectedProduct(product)}
          className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
        >
          👁
        </button>
      </div>

      <h3 className="font-semibold text-lg mb-2 text-red-700">
        {product.name}
      </h3>

      <p className="text-black font-bold text-lg">
        ₹ {selectedWeight.price}
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {product.weights.map((w: any, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedWeight(w)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedWeight.label === w.label
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          addToCart({
            id: product.id + selectedWeight.label,
            name: product.name + " (" + selectedWeight.label + ")",
            price: selectedWeight.price,
            image: product.image,
          })
        }
        className="mt-4 w-full bg-red-600 text-white py-2 rounded-full"
      >
        Add To Cart
      </button>
    </div>
  );
}

/* ===========================
   QUICK VIEW MODAL
=========================== */
function QuickView({ product, onClose, addToCart }: any) {
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0]);
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
              ₹ {selectedWeight.price}
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

            {/* Weight Options */}
            <div className="flex gap-2 mb-4">
              {product.weights.map((w: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-4 py-1 rounded-full border border-gray-400 ${
                    selectedWeight.label === w.label
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {w.label}
                </button>
              ))}
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
                  id: product.id + selectedWeight.label,
                  name: product.name + " (" + selectedWeight.label + ")",
                  price: selectedWeight.price,
                  image: product.image,
                  quantity: qty,
                });
                onClose();
              }}
              className="w-full bg-red-600 text-white py-3 rounded-full mb-3"
            >
              Add to cart
            </button>

            {/* Buy Now */}
            <button
  onClick={() => {
    addToCart({
      id: product.id + selectedWeight.label,
      name: product.name + " (" + selectedWeight.label + ")",
      price: selectedWeight.price,
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
