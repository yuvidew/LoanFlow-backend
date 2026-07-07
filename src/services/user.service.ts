import { ApplicantStatus } from "@prisma/client";
import { createApplicant, findApplicantById, findApplicants, findEligibleProducts } from "../repositories/user.repository";
import { CreateUserInput, GetUsersQuery } from "../validators/user.validator";
import { ApiError } from '../utils/api-error';
import { reevaluateApplicantById } from "./eligibility.service";

// Creates an applicant and immediately evaluates eligibility.
export const createUserService = async (
    data: CreateUserInput
) => {
    const applicant = await createApplicant({
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        creditScore: data.creditScore,
        employmentType: data.employmentType,
        salaryType: data.salaryType,
        monthlySalary: data.monthlySalary,
        status: ApplicantStatus.REJECTED,
    });

    return reevaluateApplicantById(applicant.id);
}

// Fetches a paginated applicant list with optional search and status filters.
export const getUsersService = async (
    query : GetUsersQuery
) => {
    const result = await findApplicants({
        page : query.page,
        limit: query.limit,
        search : query.search,
        status: query.status
    });

    return {
        users : result.users,
        pagination : {
            page : query.page,
            limit : query.limit,
            total : result.total,
            totalPages : Math.ceil(
                result.total / query.limit
            )
        }
    }
}

// Fetches the products an applicant qualified for.
export const getEligibleProductsService = async (applicantId : string) => {
    const applicant = await findApplicantById(applicantId);

    if(!applicant){
        throw new ApiError(404 , "Applicant not found");
    };

    await reevaluateApplicantById(applicantId);

    const eligibleProducts = await findEligibleProducts(applicantId);

    return eligibleProducts.map((item) => item.product);
}
