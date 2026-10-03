import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hardcodedProducts = [
  {
    category: "Pure Spices",
    name: "Turmeric Powder",
    image: "/turmeric.jpg",
    weights: [
      { label: "200g", price: 120 },
      { label: "500g", price: 260 },
      { label: "1kg", price: 480 },
    ],
  },
  {
    category: "Pure Spices",
    name: "Chilli Powder",
    image: "/chilli.jpg",
    weights: [
      { label: "200g", price: 140 },
      { label: "500g", price: 320 },
      { label: "1kg", price: 620 },
    ],
  },
  {
    category: "Pure Spices",
    name: "Coriander Powder",
    image: "/coriander.jpg",
    weights: [
      { label: "200g", price: 120 },
      { label: "500g", price: 270 },
      { label: "1kg", price: 500 },
    ],
  },
  {
    category: "Pure Spices",
    name: "Pepper",
    image: "/pepper.jpg",
    weights: [
      { label: "100g", price: 180 },
      { label: "250g", price: 420 },
      { label: "500g", price: 780 },
    ],
  },
  {
    category: "Spice Blends",
    name: "Sambar Powder",
    image: "/sambar.webp",
    weights: [
      { label: "200g", price: 120 },
      { label: "500g", price: 280 },
      { label: "1kg", price: 520 },
    ],
  },
  {
    category: "Spice Blends",
    name: "Garam Masala",
    image: "/garam.jpg",
    weights: [
      { label: "100g", price: 140 },
      { label: "250g", price: 320 },
      { label: "500g", price: 580 },
    ],
  },
  {
    category: "Spice Blends",
    name: "Chicken 65 Masala",
    image: "/chicken65.jpg",
    weights: [
      { label: "100g", price: 150 },
      { label: "250g", price: 340 },
      { label: "500g", price: 620 },
    ],
  },
  {
    category: "Spice Blends",
    name: "Mutton Masala",
    image: "/mutton.jpg",
    weights: [
      { label: "100g", price: 160 },
      { label: "250g", price: 360 },
      { label: "500g", price: 680 },
    ],
  },
  {
    category: "Spice Blends",
    name: "Chicken Masala",
    image: "/chicken.jpg",
    weights: [
      { label: "200g", price: 150 },
      { label: "500g", price: 350 },
      { label: "1kg", price: 650 },
    ],
  },
  {
    category: "Spice Blends",
    name: "Idli Podi",
    image: "/idlipodi.jpg",
    weights: [
      { label: "200g", price: 120 },
      { label: "500g", price: 280 },
      { label: "1kg", price: 520 },
    ],
  },
  {
    category: "Pantry",
    name: "Fried Gram",
    image: "/friedgram.jpg",
    weights: [
      { label: "250g", price: 70 },
      { label: "500g", price: 130 },
      { label: "1kg", price: 240 },
    ],
  },
  {
    category: "Pantry",
    name: "Mustard Seeds",
    image: "/mustard.jpg",
    weights: [
      { label: "100g", price: 40 },
      { label: "250g", price: 90 },
      { label: "500g", price: 160 },
    ],
  },
  {
    category: "Pantry",
    name: "Atta",
    image: "/atta.jpg",
    weights: [
      { label: "1kg", price: 65 },
      { label: "5kg", price: 310 },
      { label: "10kg", price: 600 },
    ],
  },
  {
    category: "Pantry",
    name: "Maida",
    image: "/maida.jpg",
    weights: [
      { label: "1kg", price: 55 },
      { label: "5kg", price: 260 },
      { label: "10kg", price: 500 },
    ],
  },
  {
    category: "Pantry",
    name: "Corn Flour",
    image: "/cornflour.jpg",
    weights: [
      { label: "250g", price: 60 },
      { label: "500g", price: 110 },
      { label: "1kg", price: 200 },
    ],
  },
  {
    category: "Pantry",
    name: "Rava",
    image: "/rava.jpg",
    weights: [
      { label: "500g", price: 50 },
      { label: "1kg", price: 95 },
      { label: "5kg", price: 450 },
    ],
  },
  {
    category: "Pantry",
    name: "Peanuts",
    image: "/peanuts.jpg",
    weights: [
      { label: "250g", price: 90 },
      { label: "500g", price: 170 },
      { label: "1kg", price: 320 },
    ],
  },
  {
    category: "Pantry",
    name: "Gram Flour",
    image: "/gramflour.jpg",
    weights: [
      { label: "500g", price: 70 },
      { label: "1kg", price: 130 },
      { label: "5kg", price: 620 },
    ],
  },
];

async function seed() {
  console.log("Seeding products...");
  
  let totalCount = 0;

  for (const product of hardcodedProducts) {
    for (const weight of product.weights) {
      await prisma.product.create({
        data: {
          name: product.name,
          category: product.category,
          image: product.image,
          price: weight.price,
          weight: weight.label,
          stock: 50, // default stock
          isActive: true
        }
      });
      totalCount++;
      console.log(`Created: ${product.name} - ${weight.label}`);
    }
  }

  console.log(`Successfully seeded ${totalCount} product variants!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
