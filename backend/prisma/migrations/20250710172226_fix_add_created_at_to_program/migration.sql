/*
  Warnings:

  - You are about to drop the column `userId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ProgramItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProgramItem` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Program` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_userId_fkey";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "userId",
ADD COLUMN     "items" JSONB,
ADD COLUMN     "memberId" TEXT,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProgramItem" DROP COLUMN "createdAt",
DROP COLUMN "name",
ADD COLUMN     "title" TEXT,
ALTER COLUMN "mediaUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive";

-- DropTable
DROP TABLE "Payment";

-- DropEnum
DROP TYPE "PlanTier";

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
