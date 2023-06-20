-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `furigana` VARCHAR(200) NOT NULL,
    `birthday` DATE NOT NULL,
    `sex` VARCHAR(40) NOT NULL,
    `bloodtype` VARCHAR(40) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `telephone` VARCHAR(40) NOT NULL,
    `zipcode` VARCHAR(40) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `company` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `passwordHash` VARCHAR(200) NOT NULL,
    `level` INTEGER NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    `userSectionCode` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSection` (
    `code` VARCHAR(40) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userSectionCode_fkey` FOREIGN KEY (`userSectionCode`) REFERENCES `UserSection`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;
