-- CreateTable
CREATE TABLE "DailyEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entryDate" DATE NOT NULL,
    "wellbeing" INTEGER,
    "energy" INTEGER,
    "sleepHours" DECIMAL(4,2),
    "sleepQuality" INTEGER,
    "painLevel" INTEGER,
    "stressLevel" INTEGER,
    "symptoms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyEntry_userId_entryDate_idx" ON "DailyEntry"("userId", "entryDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_userId_entryDate_key" ON "DailyEntry"("userId", "entryDate");

-- AddForeignKey
ALTER TABLE "DailyEntry" ADD CONSTRAINT "DailyEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
