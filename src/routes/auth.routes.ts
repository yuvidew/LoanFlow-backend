import {Router} from "express";
import { loginSchema } from "../validators/auth.validator";
import { validate } from "../middleware/validate";
import { login, logout, me } from "../controllers/auth.controller";
import {asyncHandler} from "../utils/async-handler";
import { authenticate } from "../middleware/authenticate";

const router = Router();

// Login endpoint
router.post(
    "/login", 
    validate(loginSchema),
    asyncHandler(login)
);

// Logout endpoint
router.post(
    "/logout", 
    asyncHandler(logout)
);

// Current authenticated user endpoint
router.get(
    "/me",
    authenticate,
    asyncHandler(me)
);

export default router;
