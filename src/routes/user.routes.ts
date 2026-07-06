import { Router } from "express";
import { createUser, getEligibleProducts, getUsers } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { createUserSchema, getUserByIdSchema, getUsersSchema } from "../validators/user.validator";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { Role } from "@prisma/client";

const router = Router();

// Creates an applicant, restricted to admins.
router.post(
    "/create-user",
    authenticate,
    authorize(Role.ADMIN),
    validate(createUserSchema),
    createUser
);

// Lists applicants for admins and viewers.
router.get(
    "/list",
    authenticate,
    authorize(Role.ADMIN, Role.VIEWER),
    validate(getUsersSchema),
    getUsers
);

// Lists products an applicant qualifies for.
router.get(
    "/:id/eligible-products",
    authenticate,
    authorize(Role.ADMIN, Role.VIEWER),
    validate(getUserByIdSchema),
    getEligibleProducts
);

export default router;
