import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: "seed-admin-user",
      name: "Admin",
      email: adminEmail,
      emailVerified: true,
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
