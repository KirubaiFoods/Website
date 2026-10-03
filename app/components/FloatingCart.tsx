"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function FloatingCart() {
  const { cart } = useCart();

  // Calculate total items in the cart
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // If cart is empty, do not show the floating icon
  if (totalItems === 0) return null;

  return (
    <Link href="/cart">
      <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center">
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-white">
          {totalItems}
        </span>
      </div>
    </Link>
  );
}
