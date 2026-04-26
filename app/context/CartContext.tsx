"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);

  // 🔥 LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // 🔥 SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ ADD TO CART (FIXED WITH QUANTITY)
  const addToCart = (product: any) => {
    const existing = cart.find((item: any) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item: any) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + (product.quantity || 1),
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: product.quantity || 1,
        },
      ]);
    }
  };

  // ❌ REMOVE ITEM
  const removeFromCart = (id: any) => {
    setCart(cart.filter((item: any) => item.id !== id));
  };

  // ➕ UPDATE QUANTITY
  const updateQuantity = (id: any, qty: number) => {
    setCart(
      cart.map((item: any) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);