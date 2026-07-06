import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "@prisma/client";
import { createProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";
import { validate } from "../middleware/validate";
import { createProductSchema } from "../validators/product.validator";

const router = Router();

// Lists products for admins and viewers.
router.get(
    "/list",
    authenticate,
    authorize(Role.ADMIN, Role.VIEWER),
    getProducts,
);

// Fetches one product for admins and viewers.
router.get(
    "/:id",
    authenticate,
    authorize(Role.ADMIN, Role.VIEWER),
    getProductById,
);

// Creates a product, restricted to admins.
router.post(
    "/create",
    authenticate,
    authorize(Role.ADMIN),
    validate(createProductSchema),
    createProduct
)

// Updates a product, restricted to admins.
router.put(
  "/:id/update",
  authenticate,
  authorize(Role.ADMIN),
  validate(createProductSchema),
  updateProduct
);

export default router;
