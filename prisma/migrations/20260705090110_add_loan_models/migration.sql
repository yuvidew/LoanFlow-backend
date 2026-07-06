-- CreateTable
CREATE TABLE `LoanApplicant` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `creditScore` INTEGER NOT NULL,
    `employmentType` ENUM('SALARIED', 'SELF_EMPLOYED', 'CONTRACT') NOT NULL,
    `salaryType` ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE') NOT NULL,
    `monthlySalary` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'REJECTED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `minAge` INTEGER NOT NULL,
    `maxAge` INTEGER NOT NULL,
    `minCreditScore` INTEGER NOT NULL,
    `allowedEmploymentTypes` JSON NOT NULL,
    `allowedSalaryTypes` JSON NOT NULL,
    `minSalary` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EligibleProduct` (
    `id` VARCHAR(191) NOT NULL,
    `applicantId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EligibleProduct_applicantId_productId_key`(`applicantId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EligibleProduct` ADD CONSTRAINT `EligibleProduct_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `LoanApplicant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EligibleProduct` ADD CONSTRAINT `EligibleProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
