-- AlterTable
ALTER TABLE "HealthProfile"
ADD COLUMN "preferredDietaryPatterns" "DietaryPattern"[] DEFAULT ARRAY[]::"DietaryPattern"[],
ADD COLUMN "excludedFoodCategories" "FoodCategory"[] DEFAULT ARRAY[]::"FoodCategory"[],
ADD COLUMN "avoidHistamine" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "maxRecipePrepMinutes" INTEGER;
