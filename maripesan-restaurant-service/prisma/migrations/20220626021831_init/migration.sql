/*
  Warnings:

  - Added the required column `accountName` to the `withdraws` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `withdraws` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank` to the `withdraws` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `withdraws` ADD COLUMN `accountName` VARCHAR(191) NOT NULL,
    ADD COLUMN `accountNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank` VARCHAR(191) NOT NULL;
