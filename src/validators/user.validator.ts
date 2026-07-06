import { z } from "zod";

// Validates applicant details before eligibility evaluation.
export const createUserSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(2, "Full name is required"),
        dateOfBirth: z.string(),
        creditScore: z.number().min(300).max(900),
        employmentType: z.enum([
            "SALARIED",
            "SELF_EMPLOYED",
        ]),

        salaryType: z.enum([
            "BANK_TRANSFER",
            "CASH",
            "CHEQUE",
        ]),

        monthlySalary: z
            .number()
            .positive(),
    })
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];

// Validates applicant list filters and pagination.
export const getUsersSchema = z.object({
    query : z.object({
        page : z.coerce.number().min(1).default(1),
        limit : z.coerce.number().min(1).max(100).default(5),
        search : z.string().optional(),
        status : z.enum(["ACTIVE", "REJECTED"]).optional(),
    })
});

export type GetUsersQuery = z.infer<typeof getUsersSchema>["query"];

// Validates applicant id params for eligible product lookups.
export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid user id"),
  }),
});

export type GetUserByIdParams = z.infer<
  typeof getUserByIdSchema
>["params"];

