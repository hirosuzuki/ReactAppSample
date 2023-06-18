/*
  Warnings:

  - Added the required column `birthday` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `birthday` DATETIME(0) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(6) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(6) NOT NULL;
