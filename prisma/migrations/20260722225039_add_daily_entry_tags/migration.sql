-- AlterTable
ALTER TABLE "DailyEntry" ADD COLUMN     "activityTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "symptomTags" TEXT[] DEFAULT ARRAY[]::TEXT[];
