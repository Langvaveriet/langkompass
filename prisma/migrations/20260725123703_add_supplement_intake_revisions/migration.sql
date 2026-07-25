-- CreateEnum
CREATE TYPE "SupplementIntakeCorrectionReason" AS ENUM ('ENTRY_ERROR', 'TIME_CORRECTION', 'DOSE_CORRECTION', 'OBSERVATION_UPDATE', 'OTHER');

-- CreateTable
CREATE TABLE "SupplementIntakeRevision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supplementIntakeId" TEXT NOT NULL,
    "previousTakenAt" TIMESTAMP(3) NOT NULL,
    "previousDose" DECIMAL(8,2) NOT NULL,
    "previousDoseUnit" "SupplementDoseUnit" NOT NULL,
    "previousTolerance" "SupplementTolerance" NOT NULL,
    "previousEffect" "SupplementEffect" NOT NULL,
    "previousNote" TEXT,
    "reason" "SupplementIntakeCorrectionReason" NOT NULL,
    "correctedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplementIntakeRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupplementIntakeRevision_userId_correctedAt_idx" ON "SupplementIntakeRevision"("userId", "correctedAt");

-- CreateIndex
CREATE INDEX "SupplementIntakeRevision_supplementIntakeId_correctedAt_idx" ON "SupplementIntakeRevision"("supplementIntakeId", "correctedAt");

-- AddForeignKey
ALTER TABLE "SupplementIntakeRevision" ADD CONSTRAINT "SupplementIntakeRevision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementIntakeRevision" ADD CONSTRAINT "SupplementIntakeRevision_supplementIntakeId_fkey" FOREIGN KEY ("supplementIntakeId") REFERENCES "SupplementIntake"("id") ON DELETE CASCADE ON UPDATE CASCADE;
