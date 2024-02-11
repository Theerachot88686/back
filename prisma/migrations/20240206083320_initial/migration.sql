/*
  Warnings:

  - Added the required column `due_date` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `due_date` DATE NOT NULL;
