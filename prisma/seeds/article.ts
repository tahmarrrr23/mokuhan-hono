import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { randomNullable } from "./util";

const prisma = new PrismaClient();

export async function seedArticle(count: number) {
  const users = await prisma.user.findMany();

  for (let i = 0; i < count; i++) {
    await prisma.article.create({
      data: {
        title: faker.lorem.sentence({ min: 1, max: 5 }),
        content: randomNullable(faker.lorem.sentence({ min: 5, max: 100 })),
        authorId: faker.helpers.arrayElement(users).id,
      },
    });
  }
}
