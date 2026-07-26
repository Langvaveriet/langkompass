CREATE TABLE "ShoppingListItemState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "itemKey" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingListItemState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ShoppingListItemState_userId_weekStart_itemKey_key"
ON "ShoppingListItemState"("userId", "weekStart", "itemKey");

CREATE INDEX "ShoppingListItemState_userId_weekStart_idx"
ON "ShoppingListItemState"("userId", "weekStart");

ALTER TABLE "ShoppingListItemState"
ADD CONSTRAINT "ShoppingListItemState_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
