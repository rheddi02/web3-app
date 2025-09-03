/*
  Warnings:

  - Made the column `date` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Investment" ALTER COLUMN "date" SET NOT NULL;
