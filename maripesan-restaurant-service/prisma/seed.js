import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const main = async () => {
  const restaurantCategory1 = await prisma.restaurantCategories.create({
    data: { category: "asian", imageUrl: "image.png" },
  });
  const restaurantCategory2 = await prisma.restaurantCategories.create({
    data: { category: "asian", imageUrl: "image.png" },
  });

  const restaurants1 = await prisma.restaurants.create({
    data: {
      restaurantCategoryId: restaurantCategory1.id,
      name: "Restoran baso mas bro",
      address: "Jl. Baso",
      thumbnailUrl: "image.png",
      balance: 0,
      active: true,
    },
  });
  const restaurants2 = await prisma.restaurants.create({
    data: {
      restaurantCategoryId: restaurantCategory2.id,
      name: "Restoran ramen ichiraku",
      address: "Jl. Ramen",
      thumbnailUrl: "image.png",
      balance: 0,
      active: true,
    },
  });
  const menuCategories1 = await prisma.menuCategories.create({
    data: {
      restaurantId: restaurants1.id,
      category: "Baso sapi",
      number: 1,
    },
  });
  const menuCategories2 = await prisma.menuCategories.createMany({
    data: {
      restaurantId: restaurants2.id,
      category: "Ramen pedas level max",
      number: 2,
    },
  });

  const menuSeed1 = await prisma.menus.create({
    data: {
      menuCategoryId: menuCategories1.id,
      name: "Baso sapi beranak + es teh manis",
      thumbnail: "image.png",
      price: 10000,
      description: "lorem ipsum",
      stok: 10,
      buffer: 0,
      active: true,
    },
  });
  const menuSeed2 = await prisma.menus.create({
    data: {
      menuCategoryId: menuCategories2.id,
      name: "Ramen telur pedas level max",
      thumbnail: "image.png",
      price: 15000,
      description: "lorem ipsum",
      stok: 10,
      buffer: 0,
      active: true,
    },
  });

  const withdrawSeed = await prisma.withdraws.createMany({
    data: [
      {
        restaurantId: restaurants1.id,
        amount: 10000,
        status: "pending",
      },
      {
        restaurantId: restaurants2.id,
        amount: 15000,
        status: "pending",
      },
    ],
  });

  console.log({
    restaurantCategory,
    restaurants,
    menuCategories,
    menuSeed,
    withdrawSeed,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
