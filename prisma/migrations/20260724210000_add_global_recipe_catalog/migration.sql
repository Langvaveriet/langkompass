-- CreateTable
CREATE TABLE "CatalogRecipe" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "description" TEXT NOT NULL,
    "prepMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "carbohydrateGrams" DECIMAL(7,2) NOT NULL,
    "proteinGrams" DECIMAL(7,2) NOT NULL,
    "fatGrams" DECIMAL(7,2) NOT NULL,
    "dietaryPatterns" "DietaryPattern"[] DEFAULT ARRAY[]::"DietaryPattern"[],
    "instructions" TEXT NOT NULL,
    "sourceLabel" TEXT,
    "sourceUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogRecipe_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "CatalogRecipeItem" (
    "id" TEXT NOT NULL,
    "catalogRecipeKey" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "foodKey" TEXT,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "quantity" DECIMAL(7,2) NOT NULL,
    "unit" "QuantityUnit" NOT NULL,
    "energyKcal" DECIMAL(7,2) NOT NULL,
    "traits" "FoodTrait"[] DEFAULT ARRAY[]::"FoodTrait"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogRecipeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CatalogRecipe_active_type_name_idx" ON "CatalogRecipe"("active", "type", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogRecipeItem_catalogRecipeKey_position_key" ON "CatalogRecipeItem"("catalogRecipeKey", "position");

-- CreateIndex
CREATE INDEX "CatalogRecipeItem_foodKey_idx" ON "CatalogRecipeItem"("foodKey");

-- CreateIndex
CREATE INDEX "CatalogRecipeItem_category_idx" ON "CatalogRecipeItem"("category");

-- AddForeignKey
ALTER TABLE "CatalogRecipeItem" ADD CONSTRAINT "CatalogRecipeItem_catalogRecipeKey_fkey" FOREIGN KEY ("catalogRecipeKey") REFERENCES "CatalogRecipe"("key") ON DELETE CASCADE ON UPDATE CASCADE;
