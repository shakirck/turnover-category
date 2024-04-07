import { faker } from "@faker-js/faker";
faker.seed(1000);
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const products = Array.from({ length: 100 }, () => ({
  name: faker.commerce.productName(),
}));

// Seed the database
async function main() {
  for (const product of products) {
    await db.categories.create({
      data: product,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
