"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    {
      id: 1,
      name: "Kulambu Masala",
      image: "/kulambu.jpg",
      mrp: 150,
      weights: [
        { label: "200g", price: 130 },
        { label: "500g", price: 300 },
        { label: "1kg", price: 550 },
      ],
    },
    {
      id: 2,
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
      id: 3,
      name: "Rasam Powder",
      image: "/rasam.webp",
      mrp: 130,
      weights: [
        { label: "200g", price: 110 },
        { label: "500g", price: 260 },
        { label: "1kg", price: 480 },
      ],
    },
    {
      id: 4,
      name: "Sambar Powder",
      image: "/sambar.webp",
      mrp: 140,
      weights: [
        { label: "200g", price: 120 },
        { label: "500g", price: 280 },
        { label: "1kg", price: 520 },
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-14">
          Our Products
        </h2>

        <div className="grid md:grid-cols-4 gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {/* ❤️ CUSTOMER LOVE SECTION */}
<section className="py-20 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto text-center">

    <h2 className="text-3xl font-bold text-red-700 mb-12">
    Customer Love ❤️
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      {/* Testimonial 1 */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-700 italic mb-4">
          "The aroma itself reminds me of my mother's cooking. Truly authentic!"
        </p>
        <h4 className="font-semibold text-red-700">– Soundararajan.</h4>
      </div>

      {/* Testimonial 2 */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-700 italic mb-4">
          "Best rasam powder I’ve ever tried. Pure and flavorful!"
        </p>
        <h4 className="font-semibold text-red-700">– Roshini S.</h4>
      </div>

      {/* Testimonial 3 */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-700 italic mb-4">
          "Feels like home food every time. Highly recommend!"
        </p>
        <h4 className="font-semibold text-red-700">– Keziah.</h4>
      </div>

    </div>
  </div>
</section>

      {/* 🔥 QUICK VIEW MODAL */}
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

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>

  {/* Image */}
  <img
    src={product.image}
    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
  />

  {/* Eye icon */}
  <button
    onClick={() => setSelectedProduct(product)}
    className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
  >
    👁
  </button>

</div>

      {/* Name */}
      <h3 className="font-semibold text-lg mb-2 text-red-700">
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-black font-bold text-lg">
  ₹ {selectedWeight.price}
</p>

      {/* Weights */}
      <div className="flex gap-2 mt-3">
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

      {/* Add to cart */}
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
