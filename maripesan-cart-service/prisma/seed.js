import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const main = async () => {
  const cart1 = await prisma.cart.create({
    data: {
      userId: "1",
      restaurantId: 1,
      process: "sekarang",
      type: "takeaway",
    },
  });
  const cart2 = await prisma.cart.create({
    data: {
      userId: "2",
      restaurantId: 1,
      process: "sekarang",
      type: "dinein",
    },
  });

  console.log({ cart1, cart2 });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
