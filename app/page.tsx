"use client";
import { Leaf, CookingPot, Flame } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Phone } from "lucide-react";
import Link from "next/link";
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
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">

  {/* BACKGROUND IMAGE */}
  <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
    <img
      src="/spices-bg.jpg"
      alt="spices background"
      className="w-[60%] max-w-[700px] md:max-w-[500px] lg:max-w-[800px] h-auto object-contain opacity-90 animate-zoom-slow"
    />
  </div>

  {/* CONTENT */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">

   <div className="flex flex-col items-center justify-center text-center gap-4">

      <div className="flex items-center gap-3 justify-center">
        <Flame className="text-[#1f4d3a] w-5 h-5 md:w-6 md:h-6" />
        <span className="text-lg md:text-2xl text-[#1f4d3a]">Real Aroma</span>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <Leaf className="text-[#1f4d3a] w-5 h-5 md:w-6 md:h-6" />
        <span className="text-lg md:text-2xl text-[#1f4d3a]">Organic</span>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <CookingPot className="text-[#1f4d3a] w-5 h-5 md:w-6 md:h-6" />
        <span className="text-lg md:text-2xl text-[#1f4d3a]">Taste</span>
      </div>

      <Link
  href="/trending"
  className="bg-[#1f4d3a] text-white px-8 py-3 rounded-full 
             transition duration-300 ease-in-out 
             hover:bg-[#163a2c] hover:bg-red-600 transition hover:scale-105 hover:shadow-lg
             active:scale-95 inline-block"
>
  Shop Now
</Link>

    </div>

  </div>
</section>

      {/* About Section */}
      <section
  id="about"
  className="w-full flex items-center justify-center px-6 py-9 md:py-14 bg-white"
>

  <div className={`max-w-4xl text-center ${aboutFont.className}`}>

    <h2 className="text-3xl md:text-4xl font-semibold text-[#1f4d3a] mb-6">
      About Kirubai Masala
    </h2>

    <p className="text-black text-base md:text-lg leading-relaxed tracking-wide">
      Kirubai Masala is rooted in the tradition of authentic Tamil home cooking. 
      Every spice blend is crafted with carefully selected ingredients and 
      time-honored recipes that preserve the true taste of homemade food.
      Our journey began with a simple belief — that food should carry the warmth 
      of home and the richness of tradition. Each masala is prepared with love, 
      ensuring purity, freshness, and unmatched flavor. We are committed to delivering 
      not just spices, but an experience — one that connects generations through 
      authentic taste and trusted quality.
    </p>

  </div>
</section>
      {/* Footer */}
<footer className="bg-[#1f4d3a] text-white px-6 py-8">

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