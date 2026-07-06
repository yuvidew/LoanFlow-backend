import { Request, Response } from "express";
import { createProductService, getProductByIdService, getProductsService, updateProductService } from "../services/product.service";
import { PRODUCT_MESSAGES } from "../constants/messages";


// Handles product creation requests and returns the created product.
export const createProduct = async (req: Request, res: Response) => {
    const product = await createProductService(req.body);

    return res.status(201).json({
        success: true,
        message: PRODUCT_MESSAGES.CREATED,
        data: product
    });
};

// Handles product update requests and returns the updated product.
export const updateProduct = async (req: Request, res: Response) => {
    const product = await updateProductService(
        req.params.id as string,
        req.body
    );

    return res.json({
        success: true,
        message: PRODUCT_MESSAGES.UPDATED,
        data: product,
    });
};

// Handles paginated product list requests with optional search.
export const getProducts = async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);
    const search = req.query.search as string;

    const result = await getProductsService({
        page,
        limit,
        search,
    });

    return res.json({
        success: true,
        message: PRODUCT_MESSAGES.FETCHED,
        data: result,
    });
}

// Handles fetching one product by id.
export const getProductById = async (
    req: Request,
    res: Response
) => {
    const product = await getProductByIdService(
        req.params.id as string
    );

    return res.json({
        success: true,
        message: PRODUCT_MESSAGES.FETCHED_ONE,
        data: product,
    });
};
