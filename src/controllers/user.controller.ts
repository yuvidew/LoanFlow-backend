import { Request, Response } from "express";
import { createUserService, getEligibleProductsService, getUsersService } from "../services/user.service";
import { getUsersSchema } from "../validators/user.validator";
import { asyncHandler } from '../utils/async-handler';

// Handles applicant creation requests and returns the evaluated applicant.
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const applicant = await createUserService(req.body);

    return res.status(201).json({
        success: true,
        message: "Applicant created successfully",
        data: applicant,
    })
});

// Handles paginated applicant list requests with optional status filtering.
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const parsedQuery = getUsersSchema.safeParse({ query: req.query });

    if (!parsedQuery.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: parsedQuery.error.issues,
        });
    }

    const data = await getUsersService(parsedQuery.data.query);

    res.json({
        success: true,
        message: "User fetch successfully",
        data
    });
});

// Handles fetching eligible products for one applicant.
export const getEligibleProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await getEligibleProductsService(
        req.params.id as string
    )

    res.status(200).json({
      success: true,
      message: "Eligible products fetched successfully",
      data: products,
    });
    
})
