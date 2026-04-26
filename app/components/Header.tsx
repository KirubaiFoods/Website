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
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                src="/logo.jpg"
                alt="logo"
                className="w-full h-full object-cover scale-125"
              />
            </div>

            <h1
              className={`text-2xl font-bold ${
                isHome ? "text-white" : "text-red-700"
              }`}
            >
              Kirubai Masala
            </h1>
          </Link>

          {/* Subtitle */}
          <p
            className={`text-sm ${
              isHome ? "text-gray-200" : "text-gray-600"
            }`}
          >
            வீட்டு சமையலின் உண்மை ருசி
          </p>

          {/* Translation toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`text-xs underline mt-1 w-fit ${
              isHome ? "text-white" : "text-red-600"
            }`}
          >
            {showTranslation ? "Hide Translation" : "See Translation"}
          </button>

          {showTranslation && (
            <p
              className={`text-xs italic mt-1 ${
                isHome ? "text-gray-200" : "text-gray-600"
              }`}
            >
              The True Taste of Homemade Cooking
            </p>
          )}
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