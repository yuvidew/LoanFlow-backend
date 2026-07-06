import {Router} from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import productRoutes from "./products.routes"

const router = Router();

// Confirms that the API server is reachable.
router.get("/health", (_req, res) => {
    res.json({
        success: true,
        message: "Server is running",
    })
});

// Mount the auth routes under the /auth path
router.use("/auth", authRoutes);

// Mount the user routes under the /users path
router.use("/users", userRoutes);

// Mount the product routes under the /product path
router.use("/products", productRoutes)

export default router;
