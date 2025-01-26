"use server";

import { prisma } from "@/db/db";
import { memoize } from "nextjs-better-unstable-cache";

export const getProducts = memoize(
  async () => {
    return await prisma.product.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  {
    persist: true,
    revalidateTags() {
      return ["products"];
    },
    log: ["datacache", "dedupe", "verbose"],
  }
);

export const getProductBySlug = memoize(
  async (slug: string) => {
    return await prisma.product.findFirst({
      where: {
        slug,
      },
    });
  },
  {
    persist: true,
    revalidateTags(slug: string) {
      return [`product:${slug}`];
    },
    log: ["datacache", "dedupe", "verbose"],
  }
);
