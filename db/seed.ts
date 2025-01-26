import { prisma } from "./db";
import sampleData from "./sample-data";

const seed = async () => {
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: sampleData.products,
  });

  console.log("The database has been seeded");
};

seed();
