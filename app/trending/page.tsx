"use client";

import { useEffect, useState } from "react";

export default function TrendingPage() {

const PRODUCTS = [
  {
    id: 0,
    name: "Chicken 65 Masala",
    img: "/products/chicken65.png",
    preview: "/products/chicken65-preview.png",
    desc: "Spicy and flavorful masala for crispy restaurant-style Chicken 65.",
  },
  {
    id: 1,
    name: "Sambar Powder",
    preview: "/products/sambar-preview.png",
    img: "/products/sambar.png",
    desc: "Authentic South Indian sambar blend with rich aroma and taste.",
  },
  {
    id: 2,
    name: "Garam Masala",
    img: "/products/garam.png",
    preview: "/products/garam-preview.png",
    desc: "Classic Indian spice mix to enhance flavor in every dish.",
  },
  {
    id: 3,
    name: "Idli Podi",
    img: "/products/idli.png",
    preview: "/products/idli-preview.png",
    desc: "Traditional podi perfect with idli, dosa and ghee.",
  },
  {
    id: 4,
    name: "Chilli Powder",
    img: "/products/chilli_powder.png",
    preview: "/products/chilli-preview.png",
    desc: "Premium quality chilli powder for vibrant color and spice.",
  },
];

const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
const [active, setActive] = useState(0);

return (
<div>

{/* HERO */}
<section className="relative min-h-screen flex flex-col justify-start pt-28 pb-12 bg-white">

  {/* BACKGROUND (LIGHT ONLY) */}
  <div className="absolute inset-0 -z-10">
    <img
      src="/elements/spices-bg.png"
      className="w-full h-full object-cover opacity-10"
    />
  </div>

  {/* TEXT */}
  <h1 className="mt-10 text-[40px] sm:text-[60px] md:text-[90px] lg:text-[120px]
  font-bold text-[#1f4d3a] text-center">
    TRENDING PRODUCTS
  </h1>

</section>

{/* PRODUCTS */}
<section className="relative min-h-screen flex flex-col justify-center pb-16 bg-white">

  <div className="relative z-20">

    {/* CIRCLES */}
    <div className="flex justify-center gap-6 md:gap-10 mt-10 flex-wrap mb-12 px-4">

      {PRODUCTS.map((p, i) => (
        <div
          key={p.id}
          className="relative group cursor-pointer flex flex-col items-center"
          onClick={() => {
            setActiveProduct(p);
            setActive(i);
          }}
        >

          <div className={`w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full border-[3px]
          flex items-center justify-center bg-white overflow-hidden
          shadow-md transition
          ${active === i ? "border-orange-500 scale-105" : "border-orange-300"}
          `}>

            <img
              src={p.img}
              className="w-[75%] h-[75%] object-contain"
            />
          </div>

          {/* HOVER LABEL */}
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition text-sm bg-orange-500 text-white px-3 py-1 rounded-full">
            {p.name}
          </div>

        </div>
      ))}

    </div>

    {/* PRODUCT PREVIEW */}
    <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10 px-6">

      <div className="w-[220px] md:w-[300px]">
        <img src={activeProduct.preview} className="w-full object-contain" />
      </div>

      <div className="max-w-[500px] text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          {activeProduct.name}
        </h2>

        <p className="text-gray-600 text-lg">
          {activeProduct.desc}
        </p>

      </div>

    </div>

  </div>
</section>

</div>
);
}