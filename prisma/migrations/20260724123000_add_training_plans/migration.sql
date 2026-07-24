-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "notes" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlanExercise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainingPlanId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlanExercise_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN "trainingPlanId" TEXT,
ADD COLUMN "planName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlan_userId_normalizedName_key" ON "TrainingPlan"("userId", "normalizedName");

-- CreateIndex
CREATE INDEX "TrainingPlan_userId_archivedAt_idx" ON "TrainingPlan"("userId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlanExercise_trainingPlanId_exerciseId_key" ON "TrainingPlanExercise"("trainingPlanId", "exerciseId");

-- CreateIndex
CREATE INDEX "TrainingPlanExercise_userId_trainingPlanId_idx" ON "TrainingPlanExercise"("userId", "trainingPlanId");

-- CreateIndex
CREATE INDEX "TrainingPlanExercise_exerciseId_idx" ON "TrainingPlanExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "TrainingSession_trainingPlanId_idx" ON "TrainingSession"("trainingPlanId");

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanExercise" ADD CONSTRAINT "TrainingPlanExercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanExercise" ADD CONSTRAINT "TrainingPlanExercise_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanExercise" ADD CONSTRAINT "TrainingPlanExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "TrainingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
