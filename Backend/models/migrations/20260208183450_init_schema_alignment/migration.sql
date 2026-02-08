/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Kid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Kid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kid" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'kid';

-- CreateIndex
CREATE UNIQUE INDEX "Kid_email_key" ON "Kid"("email");
