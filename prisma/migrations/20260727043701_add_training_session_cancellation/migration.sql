-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN     "cancelledAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "TrainingSession_userId_cancelledAt_idx" ON "TrainingSession"("userId", "cancelledAt");
