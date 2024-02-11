/*
  Warnings:

  - You are about to drop the column `createdAt` on the `field` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `field` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `field` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `field` DROP COLUMN `createdAt`,
    DROP COLUMN `isAvailable`,
    DROP COLUMN `updatedAt`;
