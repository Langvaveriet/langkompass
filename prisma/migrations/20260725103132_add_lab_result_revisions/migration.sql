-- CreateEnum
CREATE TYPE "LabCorrectionReason" AS ENUM ('ENTRY_ERROR', 'REPORT_CORRECTION', 'REFERENCE_UPDATE', 'OTHER');

-- CreateTable
CREATE TABLE "LabResultRevision" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "labResultId" UUID NOT NULL,
    "previousValue" DECIMAL(14,4) NOT NULL,
    "previousReferenceLow" DECIMAL(14,4),
    "previousReferenceHigh" DECIMAL(14,4),
    "previousNote" TEXT,
    "reason" "LabCorrectionReason" NOT NULL,
    "correctedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabResultRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LabResultRevision_userId_correctedAt_idx" ON "LabResultRevision"("userId", "correctedAt");

-- CreateIndex
CREATE INDEX "LabResultRevision_labResultId_correctedAt_idx" ON "LabResultRevision"("labResultId", "correctedAt");

-- AddForeignKey
ALTER TABLE "LabResultRevision" ADD CONSTRAINT "LabResultRevision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResultRevision" ADD CONSTRAINT "LabResultRevision_labResultId_fkey" FOREIGN KEY ("labResultId") REFERENCES "LabResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
