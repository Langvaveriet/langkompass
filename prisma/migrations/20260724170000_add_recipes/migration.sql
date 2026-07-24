-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "type" "MealType" NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "foodKey" TEXT,
    "name" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "portion" "PortionSize" NOT NULL DEFAULT 'MEDIUM',
    "quantity" DECIMAL(7,2),
    "unit" "QuantityUnit",
    "energyKcal" DECIMAL(7,2),
    "traits" "FoodTrait"[] DEFAULT ARRAY[]::"FoodTrait"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_userId_normalizedName_key" ON "Recipe"("userId", "normalizedName");

-- CreateIndex
CREATE INDEX "Recipe_userId_archivedAt_updatedAt_idx" ON "Recipe"("userId", "archivedAt", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeItem_recipeId_position_key" ON "RecipeItem"("recipeId", "position");

-- CreateIndex
CREATE INDEX "RecipeItem_userId_recipeId_idx" ON "RecipeItem"("userId", "recipeId");

-- CreateIndex
CREATE INDEX "RecipeItem_foodKey_idx" ON "RecipeItem"("foodKey");

-- CreateIndex
CREATE INDEX "RecipeItem_category_idx" ON "RecipeItem"("category");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
