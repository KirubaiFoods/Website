import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  for (const product of products) {
    let newImage = product.image;
    const name = product.name.toLowerCase();

    if (name.includes('idli')) {
      newImage = '/products/idli.png';
    } else if (name.includes('chicken 65')) {
      newImage = '/products/chicken65.png';
    } else if (name.includes('chicken')) {
      newImage = '/chicken.jpg';
    } else if (name.includes('mutton')) {
      newImage = '/products/masala.png';
    } else if (name.includes('garam')) {
      newImage = '/products/garam.png';
    } else if (name.includes('sambar')) {
      newImage = '/products/sambar.png';
    } else if (name.includes('pepper')) {
      newImage = '/ingredients/spice.png';
    } else if (name.includes('coriander')) {
      newImage = '/products/masala.png';
    } else if (name.includes('chilli')) {
      newImage = '/products/chilli.png';
    } else if (name.includes('turmeric')) {
      newImage = '/products/turmeric.png';
    }

    if (newImage !== product.image) {
      await prisma.product.update({
        where: { id: product.id },
        data: { image: newImage },
      });
      console.log(`Updated ${product.name} to ${newImage}`);
    }
  }
  console.log('Done updating images.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
