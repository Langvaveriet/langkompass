-- CreateTable
CREATE TABLE "LabReferenceRange" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "analyteKey" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "referenceLow" DECIMAL(14,4),
    "referenceHigh" DECIMAL(14,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabReferenceRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LabReferenceRange_userId_analyteKey_idx" ON "LabReferenceRange"("userId", "analyteKey");

-- CreateIndex
CREATE UNIQUE INDEX "LabReferenceRange_userId_analyteKey_key" ON "LabReferenceRange"("userId", "analyteKey");

-- AddForeignKey
ALTER TABLE "LabReferenceRange" ADD CONSTRAINT "LabReferenceRange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
