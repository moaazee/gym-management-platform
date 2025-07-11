-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isLatest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);
