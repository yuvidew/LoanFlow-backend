import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
}

// Finds one product by id.
export const findProductById = async (id: string) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

// Finds one product by exact name to prevent duplicates.
export const findProductByName = async (name: string) => {
  return prisma.product.findFirst({
    where: {
      name: {
        equals: name,
      },
    },
  });
};

// Persists a new product record.
export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return prisma.product.create({
    data,
  });
};

// Persists updates for an existing product.
export const updateProduct = async (
  id: string,
  data: Prisma.ProductUpdateInput
) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

// Fetches a paginated product list with optional name search.
export const getProducts = async ({
  page,
  limit,
  search,
}: GetProductsParams) => {
  return prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,

    where: search
      ? {
          name: {
            contains: search,
          },
        }
      : undefined,

    orderBy: {
      createdAt: "desc",
    },
  });
};

// Counts products matching the optional search filter.
export const countProducts = async (search?: string) => {
  return prisma.product.count({
    where: search
      ? {
          name: {
            contains: search,
          },
        }
      : undefined,
  });
};
