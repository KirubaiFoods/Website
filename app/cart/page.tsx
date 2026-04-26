"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalAmount = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const FREE_SHIPPING_THRESHOLD = 499;

const remainingAmount = FREE_SHIPPING_THRESHOLD - totalAmount;

const progressPercentage = Math.min(
  (totalAmount / FREE_SHIPPING_THRESHOLD) * 100,
  100
);
  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-6">
      {/* 🚚 MARQUEE BANNER */}
  <div className="bg-red-700 text-white py-2 overflow-hidden shadow-sm">
  <div className="marquee text-sm font-medium">
    🚚 Free Shipping on all Orders above Rs.499/-
  </div>
</div>

      <div className="max-w-7xl mx-auto">

               {cart.length === 0 ? (
          <div className="text-center py-20">

  {/* Emoji */}
  <div className="text-6xl mb-4">🛒</div>

  {/* Title */}
  <h2 className="text-2xl font-semibold text-red-700 mb-2">
    Your cart feels lonely!
  </h2>

  {/* Subtitle */}
  <p className="text-gray-700 mb-6">
    Add some delicious masalas and bring it to life 🌶️✨
  </p>

  {/* CTA BUTTON */}
  <Link href="/products">
    <button className="bg-red-700 text-white px-8 py-3 rounded-full hover:bg-red-800 transition">
      Explore Products
    </button>
  </Link>

</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">

            {/* 🛒 LEFT SIDE - ITEMS */}
            <div className="md:col-span-2 space-y-6">

              {cart.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl shadow flex items-center justify-between"
                >

                  {/* Product Info */}
                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div>
                      <h2 className="font-semibold text-lg text-red-700">
                        {item.name}
                      </h2>

                      <p className="text-gray-800">₹ {item.price}</p>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6">

                    {/* Quantity */}
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-1 gap-4 bg-white">
  
  <button
    onClick={() => updateQuantity(item.id, item.quantity - 1)}
    className="text-black font-bold text-lg"
  >
    −
  </button>

  <span className="text-black font-semibold">
    {item.quantity}
  </span>

  <button
    onClick={() => updateQuantity(item.id, item.quantity + 1)}
    className="text-black font-bold text-lg"
  >
    +
  </button>

</div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-black hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>

                    {/* Price */}
                    <p className="font-semibold w-20 text-right text-black">
                      ₹ {item.price * item.quantity}
                    </p>

                  </div>

                </div>
              ))}

            </div>

            {/* 💰 RIGHT SIDE - SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow h-fit">

              <h2 className="text-xl font-semibold text-red-700 mb-4">
                Order Summary
              </h2>
              {/* 🚚 FREE SHIPPING PROGRESS */}
{totalAmount < 499 && (
  <div className="bg-yellow-100 p-4 rounded-lg mb-4">
    <p className="text-sm text-yellow-900 mb-2">
      🚚 Add ₹ {499 - totalAmount} more to get FREE shipping
    </p>

    <div className="w-full bg-gray-300 h-2 rounded-full">
      <div
        className="bg-yellow-500 h-2 rounded-full transition-all"
        style={{
          width: `${Math.min((totalAmount / 499) * 100, 100)}%`,
        }}
      />
    </div>
  </div>
)}

{totalAmount >= 499 && (
  <div className="bg-green-100 p-4 rounded-lg mb-4 text-green-800 text-sm">
    🎉 You’ve unlocked FREE shipping!
  </div>
)}

              <div className="flex justify-between mb-2 text-gray-800">
                <span>Subtotal</span>
                <span>₹ {totalAmount}</span>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Shipping calculated at checkout
              </p>

              <a href="/checkout">
  <button className="mt-4 w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 transition">
  Checkout
</button>
</a>

              <Link href="/products">
                <button className="w-full border border-gray-400 text-black py-3 rounded-lg hover:bg-gray-100 transition">
                  Continue Shopping
                </button>
              </Link>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}