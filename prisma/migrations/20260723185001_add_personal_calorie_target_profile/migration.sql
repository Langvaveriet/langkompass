-- CreateEnum
CREATE TYPE "CalorieFormulaSex" AS ENUM ('FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "WeightGoal" AS ENUM ('LOSE', 'MAINTAIN', 'GAIN');

-- AlterTable
ALTER TABLE "HealthProfile" ADD COLUMN     "activityLevel" "ActivityLevel",
ADD COLUMN     "calorieFormulaSex" "CalorieFormulaSex",
ADD COLUMN     "manualDailyCalorieTarget" INTEGER,
ADD COLUMN     "weightGoal" "WeightGoal";
