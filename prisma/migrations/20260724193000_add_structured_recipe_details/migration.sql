-- CreateEnum
CREATE TYPE "RecipeOrigin" AS ENUM ('USER', 'CURATED');

-- CreateEnum
CREATE TYPE "DietaryPattern" AS ENUM ('MEDITERRANEAN', 'KETOGENIC', 'VEGETARIAN');

-- AlterTable
ALTER TABLE "Recipe"
ADD COLUMN "origin" "RecipeOrigin" NOT NULL DEFAULT 'USER',
ADD COLUMN "description" TEXT,
ADD COLUMN "prepMinutes" INTEGER,
ADD COLUMN "servings" INTEGER,
ADD COLUMN "instructions" TEXT,
ADD COLUMN "carbohydrateGrams" DECIMAL(7,2),
ADD COLUMN "proteinGrams" DECIMAL(7,2),
ADD COLUMN "fatGrams" DECIMAL(7,2),
ADD COLUMN "dietaryPatterns" "DietaryPattern"[] DEFAULT ARRAY[]::"DietaryPattern"[],
ADD COLUMN "sourceLabel" TEXT,
ADD COLUMN "sourceUrl" TEXT;
