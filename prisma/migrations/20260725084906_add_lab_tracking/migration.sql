-- CreateEnum
CREATE TYPE "FastingStatus" AS ENUM ('UNKNOWN', 'FASTING', 'NOT_FASTING');

-- CreateTable
CREATE TABLE "LabReport" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL,
    "fastingStatus" "FastingStatus" NOT NULL DEFAULT 'UNKNOWN',
    "laboratory" TEXT,
    "physicianComment" TEXT,
    "controlDate" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "labReportId" UUID NOT NULL,
    "analyteKey" TEXT NOT NULL,
    "analyteName" TEXT NOT NULL,
    "value" DECIMAL(14,4) NOT NULL,
    "unit" TEXT NOT NULL,
    "referenceLow" DECIMAL(14,4),
    "referenceHigh" DECIMAL(14,4),
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "source" "EntrySource" NOT NULL DEFAULT 'MANUAL',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LabReport_userId_collectedAt_idx" ON "LabReport"("userId", "collectedAt");

-- CreateIndex
CREATE INDEX "LabResult_userId_analyteKey_measuredAt_idx" ON "LabResult"("userId", "analyteKey", "measuredAt");

-- CreateIndex
CREATE INDEX "LabResult_labReportId_idx" ON "LabResult"("labReportId");

-- CreateIndex
CREATE UNIQUE INDEX "LabResult_labReportId_analyteKey_key" ON "LabResult"("labReportId", "analyteKey");

-- AddForeignKey
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_labReportId_fkey" FOREIGN KEY ("labReportId") REFERENCES "LabReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
