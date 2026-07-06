import { z } from "zod";

// Validates product details and eligibility criteria input.
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),

    minAge: z.number().int().min(18),
    maxAge: z.number().int().min(18),
    minCreditScore: z.number().int().min(300).max(900),

    allowedEmploymentTypes: z.array(
      z.enum(["SALARIED", "SELF_EMPLOYED"])
    ).min(1),

    allowedSalaryTypes: z.array(
      z.enum(["BANK_TRANSFER", "CHEQUE", "CASH"])
    ).min(1),

    minSalary: z.number().positive(),
  }).refine((data) => data.maxAge > data.minAge, {
    message: "Maximum age must be greater than minimum age",
    path: ["maxAge"],
  }),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>["body"];

export type UpdateProductInput = z.infer<
  typeof createProductSchema
>["body"];
