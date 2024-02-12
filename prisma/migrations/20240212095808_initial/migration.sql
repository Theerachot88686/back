/*
  Warnings:

  - You are about to drop the column `due_date` on the `booking` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `due_date`,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL;
