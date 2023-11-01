import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import cuid from 'cuid';

const prisma = new PrismaClient();

const main = async () => {
  const role1 = await prisma.role.create({
    data: {
      role: "admin",
    },
  });
  const role2 = await prisma.role.create({
    data: {
      role: "user",
    },
  });
  const user1 = await prisma.user.create({
    data: {
      id: cuid(),
      name: "John Doe",
      phone: "+55 11 99999-9999",
      imageUrl: "https://avatars2.githubusercontent.com/u/174825?s=460&v=4",
      email: "john@email.com",
      provider: ["password"],
      roleId: role1.id,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: cuid(),
      name: "Jane Doe",
      phone: "+55 11 99999-9999",
      imageUrl: "https://avatars2.githubusercontent.com/u/174821?s=460&v=4",
      email: "jane@email.com",
      provider: ["password"],
      roleId: role1.id,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      id: cuid(),
      name: "John Smith",
      phone: "+55 11 99999-9999",
      imageUrl: "https://avatars2.githubusercontent.com/u/174822?s=460&v=4",
      email: "johnsmith@email.com",
      provider: ["password"],
      roleId: role2.id,
    },
  });
  const user4 = await prisma.user.create({
    data: {
      id: cuid(),
      name: "Jane Smith",
      phone: "+55 11 99999-9999",
      imageUrl: "https://avatars2.githubusercontent.com/u/174823?s=460&v=4",
      email: "janesmith@email.com",
      provider: ["password"],
      roleId: role2.id,
    },
  });
  const user5 = await prisma.user.create({
    data: {
      id: cuid(),
      name: "John Bob",
      phone: "+55 11 99999-9999",
      imageUrl: "https://avatars2.githubusercontent.com/u/174824?s=460&v=4",
      email: "johnbob@email.com",
      provider: ["password"],
      roleId: role2.id,
    },
  });

  console.log({ role1, role2, user1, user2, user3, user4, user5 });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
