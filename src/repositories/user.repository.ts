import prisma from "../config/prisma";
import { Prisma, LoanApplicant, ApplicantStatus } from "@prisma/client";

// Persists a new loan applicant record.
export const createApplicant = async (
    data: Prisma.LoanApplicantCreateInput
): Promise<LoanApplicant> => {
    return prisma.loanApplicant.create({
        data
    })
};

interface FindApplicantsParams {
    page: number;
    limit: number;
    search?: string;
    status?: ApplicantStatus;
};

// Fetches paginated applicants with optional name and status filters.
export const findApplicants = async ({
    page,
    limit,
    search,
    status,
}: FindApplicantsParams) => {
    const where: Prisma.LoanApplicantWhereInput = {};

    if (search) {
        where.fullName = {
            contains: search,
        };
    }

    if (status) {
        where.status = status;
    }

    const [users, total] = await prisma.$transaction([
        prisma.loanApplicant.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        }),

        prisma.loanApplicant.count({
            where,
        }),
    ]);

    return {
        users,
        total,
    };
};

// Finds one applicant by id before reading eligibility details.
export const findApplicantById = async (id : string) => {
    return prisma.loanApplicant.findUnique({
        where : {
            id
        },
    });
}

// Fetches product records linked as eligible for an applicant.
export const findEligibleProducts = async (applicantId : string) => {
    return prisma.eligibleProduct.findMany({
        where: {
            applicantId
        },
        include : {
            product : {
                select : {
                    id : true,
                    name: true,
                    description : true,
                },
            },
        },
    });
}
