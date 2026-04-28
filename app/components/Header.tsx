"use client";

import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const isProducts = pathname === "/products";

  const isTransparent = isHome || isProducts;

  const { cart } = useCart();

  const totalItems = cart.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (isAdminPage) return null;
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      } ${
        isTransparent
          ? "bg-transparent border-none shadow-none"
          : "bg-white shadow-md border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">

        {/* LEFT SIDE */}
        <div className="flex flex-col">

          {/* LOGO + BRAND */}
          <Link href="/" className="flex items-center gap-2">
            <img
  src="/logo.png"
  alt="Kirubai Logo"
  className="h-12 w-auto object-contain bg-transparent"
/>
            
          </Link>

         


        </div>

        {/* RIGHT SIDE NAV */}
        <nav className="flex gap-4 font-semibold items-center">

          {/* Home */}
          {pathname !== "/" && (
            <Link
              href="/"
              className={`${
                isProducts ? "text-red-700" : "text-black"
              } hover:text-red-600 transition`}
            >
              Home
            </Link>
          )}
          
          {/* Cart */}
          <Link
            href="/cart"
            className={`flex items-center gap-2 ${
              isHome
                ? "text-white"
                : isProducts
                ? "text-red-700"
                : "text-black"
            } hover:text-red-600 transition`}
          >
            <ShoppingCart
              size={22}
              className={
                isHome
                  ? "text-white"
                  : isProducts
                  ? "text-red-700"
                  : "text-black"
              }
            />
            <span className="text-sm">({totalItems})</span>
          </Link>

        </nav>
      </div>
    </header>
  );
}