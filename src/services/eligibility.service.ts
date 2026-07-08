import { ApplicantStatus, LoanApplicant, Prisma, Product } from "@prisma/client";
import prisma from "../config/prisma";

type ApplicantForEligibility = Pick<
  LoanApplicant,
  | "id"
  | "dateOfBirth"
  | "creditScore"
  | "employmentType"
  | "salaryType"
  | "monthlySalary"
>;

type ProductForEligibility = Pick<
  Product,
  | "id"
  | "minAge"
  | "maxAge"
  | "minCreditScore"
  | "allowedEmploymentTypes"
  | "allowedSalaryTypes"
  | "minSalary"
>;

// Calculates applicant age from DOB at evaluation time.
export const calculateAge = (dateOfBirth: Date, asOf = new Date()) => {
  let age = asOf.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = asOf.getMonth() - dateOfBirth.getMonth();
  const hasBirthdayPassed =
    monthDiff > 0 ||
    (monthDiff === 0 && asOf.getDate() >= dateOfBirth.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
};

// Normalizes Prisma JSON array fields before criteria matching.
const toStringArray = (value: unknown): string[] => {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
};

// Checks whether one applicant satisfies all criteria for one product.
export const isApplicantEligibleForProduct = (
  applicant: ApplicantForEligibility,
  product: ProductForEligibility,
  asOf = new Date()
) => {
  const age = calculateAge(applicant.dateOfBirth, asOf);
  const allowedEmploymentTypes = toStringArray(
    product.allowedEmploymentTypes
  );
  const allowedSalaryTypes = toStringArray(product.allowedSalaryTypes);

  return (
    age >= product.minAge &&
    age <= product.maxAge &&
    applicant.creditScore >= product.minCreditScore &&
    allowedEmploymentTypes.includes(applicant.employmentType) &&
    allowedSalaryTypes.includes(applicant.salaryType) &&
    Number(applicant.monthlySalary) >= Number(product.minSalary)
  );
};

// Returns every product an applicant qualifies for.
export const evaluateApplicantProducts = (
  applicant: ApplicantForEligibility,
  products: ProductForEligibility[],
  asOf = new Date()
) => {
  return products.filter((product) =>
    isApplicantEligibleForProduct(applicant, product, asOf)
  );
};

// Recalculates one applicant's status and eligible product links.
export const reevaluateApplicantById = async (applicantId: string) => {
  const applicant = await prisma.loanApplicant.findUnique({
    where: { id: applicantId },
  });

  if (!applicant) {
    return null;
  }

  const products = await prisma.product.findMany();
  const eligibleProducts = evaluateApplicantProducts(applicant, products);
  const status =
    eligibleProducts.length > 0
      ? ApplicantStatus.ACTIVE
      : ApplicantStatus.REJECTED;

  return prisma.$transaction(async (tx) => {
    await tx.eligibleProduct.deleteMany({
      where: { applicantId },
    });

    const updatedApplicant = await tx.loanApplicant.update({
      where: { id: applicantId },
      data: { status },
    });

    if (eligibleProducts.length > 0) {
      await tx.eligibleProduct.createMany({
        data: eligibleProducts.map((product) => ({
          applicantId,
          productId: product.id,
        })),
      });
    }

    return updatedApplicant;
  });
};

// Recalculates statuses and eligible product links for all applicants.
export const reevaluateAllApplicants = async () => {
  const [applicants, products] = await Promise.all([
    prisma.loanApplicant.findMany(),
    prisma.product.findMany(),
  ]);

  const activeApplicantIds: string[] = [];
  const rejectedApplicantIds: string[] = [];
  const eligibleProductRows: Prisma.EligibleProductCreateManyInput[] = [];

  for (const applicant of applicants) {
    const eligibleProducts = evaluateApplicantProducts(applicant, products);

    if (eligibleProducts.length > 0) {
      activeApplicantIds.push(applicant.id);
      eligibleProductRows.push(
        ...eligibleProducts.map((product) => ({
          applicantId: applicant.id,
          productId: product.id,
        }))
      );
    } else {
      rejectedApplicantIds.push(applicant.id);
    }
  }

  const operations: Prisma.PrismaPromise<unknown>[] = [
    prisma.eligibleProduct.deleteMany(),
  ];

  if (activeApplicantIds.length > 0) {
    operations.push(
      prisma.loanApplicant.updateMany({
        where: { id: { in: activeApplicantIds } },
        data: { status: ApplicantStatus.ACTIVE },
      })
    );
  }

  if (rejectedApplicantIds.length > 0) {
    operations.push(
      prisma.loanApplicant.updateMany({
        where: { id: { in: rejectedApplicantIds } },
        data: { status: ApplicantStatus.REJECTED },
      })
    );
  }

  if (eligibleProductRows.length > 0) {
    operations.push(
      prisma.eligibleProduct.createMany({
        data: eligibleProductRows,
      })
    );
  }

  await prisma.$transaction(operations);

  return applicants.length;
};
