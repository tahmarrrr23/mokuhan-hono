import { PrismaClient } from "@prisma/client";
import { seedArticle } from "./article";
import { seedUser } from "./user";

const prisma = new PrismaClient();

async function main() {
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();
  await seedUser(50);
  await seedArticle(100);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
