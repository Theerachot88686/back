/*
  Warnings:

  - Added the required column `dueDate` to the `BookingHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookinghistory` ADD COLUMN `dueDate` DATETIME(3) NOT NULL;
