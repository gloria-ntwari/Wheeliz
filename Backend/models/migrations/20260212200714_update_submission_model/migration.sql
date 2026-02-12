/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `files` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kid" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpires" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "fileUrl",
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "files" TEXT NOT NULL,
ADD COLUMN     "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
