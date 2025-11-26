import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedUser(count: number) {
  for (let i = 0; i < count; i++) {
    await prisma.user.create({
      data: {
        username: faker.string.alpha({ length: 10, casing: "lower" }),
        nickname: faker.person.fullName(),
      },
    });
  }
}
