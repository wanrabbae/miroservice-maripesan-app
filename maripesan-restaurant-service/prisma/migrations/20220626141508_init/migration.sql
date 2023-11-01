/*
  Warnings:

  - You are about to alter the column `status` on the `withdraws` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("withdraws_status")`.

*/
-- AlterTable
ALTER TABLE `withdraws` MODIFY `status` ENUM('Pending', 'Succeed', 'Failed') NOT NULL DEFAULT 'Pending';
