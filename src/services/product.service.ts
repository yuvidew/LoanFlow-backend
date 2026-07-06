import { PRODUCT_MESSAGES } from '../constants/messages';
import { countProducts, createProduct, findProductById, findProductByName, getProducts, updateProduct } from '../repositories/product.repository';
import { ApiError } from '../utils/api-error';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validator';
import { reevaluateAllApplicants } from './eligibility.service';


// Creates a product and re-evaluates all applicants against the new criteria.
export const createProductService = async (data: CreateProductInput) => {
    const existing = await findProductByName(data.name);

    if (existing) {
        throw new ApiError(409, PRODUCT_MESSAGES.ALREADY_EXISTS);
    };

    const product = await createProduct(data);
    await reevaluateAllApplicants();

    return product;
};

// Updates a product and re-evaluates all applicants after criteria changes.
export const updateProductService = async (
    id: string,
    data: UpdateProductInput
) => {
    const product = await findProductById(id);

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGES.NOT_FOUND);
    }

    if (data.name && data.name !== product.name) {
        const duplicate = await findProductByName(data.name);

        if (duplicate) {
            throw new ApiError(409, PRODUCT_MESSAGES.ALREADY_EXISTS);
        };
    };

    const updatedProduct = await updateProduct(id, data);
    await reevaluateAllApplicants();

    return updatedProduct;
};

// Fetches a paginated product list and pagination metadata.
export const getProductsService = async ({
    page,
    limit,
    search
}: {
    page: number;
    limit: number;
    search: string;
}) => {
    const [products, total] = await Promise.all([
        getProducts({
            page,
            limit,
            search,
        }),
        countProducts(search),
    ]);

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// Fetches one product or throws when the id does not exist.
export const getProductByIdService = async (
  id: string
) => {
  const product = await findProductById(id);

  if (!product) {
    throw new ApiError(404, PRODUCT_MESSAGES.NOT_FOUND);
  }

  return product;
};
