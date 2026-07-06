import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Seeds login users, loan products, and sample applicants for local setup.
const main = async () => {
    const password = await bcrypt.hash('Admin@123', 10);

    // Upsert the admin user
    await prisma.user.upsert({
        where:{
             email: "admin@loanpanel.com",
        },
        update: {},
        create : {
            name : "Admin",
            email : "admin@loanpanel.com",
            password : password,
            role : "ADMIN"
        },
    });

    const viewerPassword = await bcrypt.hash('Viewer@123', 10);

    // Upsert the user role
    await prisma.user.upsert({
        where:{
            email: "viewer@loanpanel.com"
        },
        update: {},
        create : {
            name : "Viewer",
            email : "viewer@loanpanel.com",
            password : viewerPassword,
            role : "VIEWER"
        },
    });

    await prisma.eligibleProduct.deleteMany();
    await prisma.loanApplicant.deleteMany();
    await prisma.product.deleteMany();

    const personalLoan = await prisma.product.create({
        data: {
            name: "Personal Loan",
            description: "Loan for salaried applicants with bank transfer salary.",
            minAge: 21,
            maxAge: 58,
            minCreditScore: 700,
            allowedEmploymentTypes: ["SALARIED"],
            allowedSalaryTypes: ["BANK_TRANSFER", "CHEQUE"],
            minSalary: 25000,
        },
    });

    const businessLoan = await prisma.product.create({
        data: {
            name: "Business Loan",
            description: "Loan for self-employed applicants with strong credit.",
            minAge: 25,
            maxAge: 60,
            minCreditScore: 720,
            allowedEmploymentTypes: ["SELF_EMPLOYED"],
            allowedSalaryTypes: ["BANK_TRANSFER", "CHEQUE"],
            minSalary: 50000,
        },
    });

    await prisma.loanApplicant.create({
        data: {
            fullName: "Aarav Sharma",
            dateOfBirth: new Date("1995-04-12"),
            creditScore: 745,
            employmentType: "SALARIED",
            salaryType: "BANK_TRANSFER",
            monthlySalary: 45000,
            status: "ACTIVE",
            eligibleProducts: {
                create: {
                    productId: personalLoan.id,
                },
            },
        },
    });

    await prisma.loanApplicant.create({
        data: {
            fullName: "Meera Patel",
            dateOfBirth: new Date("1990-09-20"),
            creditScore: 760,
            employmentType: "SELF_EMPLOYED",
            salaryType: "CHEQUE",
            monthlySalary: 80000,
            status: "ACTIVE",
            eligibleProducts: {
                create: {
                    productId: businessLoan.id,
                },
            },
        },
    });

    await prisma.loanApplicant.create({
        data: {
            fullName: "Rohan Verma",
            dateOfBirth: new Date("2003-11-05"),
            creditScore: 640,
            employmentType: "SALARIED",
            salaryType: "CASH",
            monthlySalary: 18000,
            status: "REJECTED",
        },
    });
};

main()
 // Disconnects Prisma after a successful seed run.
 .then(() => prisma.$disconnect())
  // Logs seed failures and closes Prisma before exiting.
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
