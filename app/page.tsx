"use client";

import { ChevronDown } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Phone } from "lucide-react";

const aboutFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function HomePage() {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setZoom((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-center text-white pt-0 overflow-hidden">
  
        {/* ✅ UPDATED BACKGROUND IMAGE WITH ZOOM */}
        <img
          src="/background.jpg"
          alt="background"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-in-out ${
            zoom ? "scale-110" : "scale-100"
          }`}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 px-6 -mt-10">
          <h1
  className={`text-5xl md:text-7xl font-semibold tracking-wide leading-tight ${aboutFont.className}`}
>
            Authentic Tamil Spice Blends
          </h1>

          <p className="text-lg md:text-xl mb-8">
            Pure Ingredients. Traditional Recipes. Trusted Quality.
          </p>

          <a
            href="/products"
            className="bg-white text-red-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Shop Now
          </a>

          <a href="#about" className="flex justify-center mt-10 animate-bounce">
            <ChevronDown size={32} className="text-white opacity-80" />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
  id="about"
  className="relative w-full flex-1 flex items-start justify-center px-6 pt-16 pb-6 bg-white overflow-hidden"
>

        <img
          src="/logo.jpg"
          alt="bg logo"
          className="absolute inset-0 m-auto w-[800px] opacity-10 pointer-events-none select-none -z-10"
        />

        <div className={`relative z-10 max-w-4xl mx-auto text-center ${aboutFont.className}`}>

          <h2 className="text-3xl md:text-4xl font-semibold text-red-700 mb-4 mt-6">
            About Kirubai Masala
          </h2>

          <p className="text-black text-lg leading-normal tracking-wide mb-2">
            Kirubai Masala is rooted in the tradition of authentic Tamil home cooking. 
            Every spice blend is crafted with carefully selected ingredients and 
            time-honored recipes that preserve the true taste of homemade food.
            Our journey began with a simple belief — that food should carry the warmth 
            of home and the richness of tradition. Each masala is prepared with love, 
            ensuring purity, freshness, and unmatched flavor.We are committed to delivering not just spices, but an experience — one that 
            connects generations through authentic taste and trusted quality.
          </p>

          <p className="text-gray-900 text-base leading-normal tracking-wide mb-">
            
          </p>

          <p className="text-black text-base leading-normal tracking-wide mb-2">
            
          </p>

        </div>
      </section>
      {/* Footer */}
<footer className="bg-red-800 text-white px-6 py-8">

  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

    {/* Explore */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Explore</h3>
      <ul className="space-y-2 text-gray-200 text-sm">
        <li><a href="/contact" className="hover:underline">Contact us</a></li>
        <li><a href="/privacy" className="hover:underline">Privacy policy</a></li>
        <li><a href="/terms" className="hover:underline">Terms of service</a></li>
        <li><a href="/returns" className="hover:underline">Return & Refund policy</a></li>
        <li><a href="/shipping" className="hover:underline">Shipping policy</a></li>
        <li><a href="/track-order" className="hover:underline">Track your order</a></li>
      </ul>
    </div>

    {/* Social */}
    <div className="text-left">
      <h3 className="text-xl font-semibold mb-4">Let’s connect</h3>
      <p className="text-sm text-gray-200 mb-4">
        Follow us on our Social Media Channels.
      </p>

      <div className="flex justify-start gap-4">

  <a href="#" className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-red-800 transition">
    <Facebook size={18} />
  </a>

  <a href="#" className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-red-800 transition">
    <Instagram size={18} />
  </a>

  <a href="#" className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-red-800 transition">
    <Youtube size={18} />
  </a>

  <a href="tel:+91XXXXXXXXXX" className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-red-800 transition">
    <Phone size={18} />
  </a>

</div>
    </div>

  </div>

</footer>

    </main>
  );
}