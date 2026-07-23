-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DRINK');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('VEGETABLE', 'FRUIT', 'GRAIN', 'LEGUME', 'NUT_SEED', 'DAIRY', 'EGG', 'MEAT', 'FISH_SEAFOOD', 'FAT_OIL', 'SWEET', 'BEVERAGE', 'CONDIMENT', 'PREPARED_MEAL', 'OTHER');

-- CreateEnum
CREATE TYPE "PortionSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('GRAM', 'MILLILITER', 'PIECE', 'PORTION', 'TABLESPOON', 'TEASPOON', 'CUP');

-- CreateEnum
CREATE TYPE "FoodTrait" AS ENUM ('HISTAMINE_RICH', 'HISTAMINE_LIBERATOR', 'ALCOHOLIC', 'HIGH_SUGAR', 'HIGHLY_PROCESSED', 'FERMENTED', 'CAFFEINATED');

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "dailyEntryId" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "consumedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "postMealSymptomTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reactionDelayMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealItem" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "foodKey" TEXT,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "portion" "PortionSize" NOT NULL DEFAULT 'MEDIUM',
    "quantity" DECIMAL(7,2),
    "unit" "QuantityUnit",
    "traits" "FoodTrait"[] DEFAULT ARRAY[]::"FoodTrait"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meal_dailyEntryId_consumedAt_idx" ON "Meal"("dailyEntryId", "consumedAt");

-- CreateIndex
CREATE INDEX "MealItem_mealId_idx" ON "MealItem"("mealId");

-- CreateIndex
CREATE INDEX "MealItem_foodKey_idx" ON "MealItem"("foodKey");

-- CreateIndex
CREATE INDEX "MealItem_category_idx" ON "MealItem"("category");

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_dailyEntryId_fkey" FOREIGN KEY ("dailyEntryId") REFERENCES "DailyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
