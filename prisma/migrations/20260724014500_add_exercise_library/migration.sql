-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('STRENGTH', 'MOBILITY', 'CARDIO', 'BALANCE');

-- CreateEnum
CREATE TYPE "ExerciseEquipment" AS ENUM ('BODYWEIGHT', 'DUMBBELL', 'BARBELL', 'KETTLEBELL', 'MACHINE', 'CABLE', 'RESISTANCE_BAND', 'CARDIO_MACHINE', 'OTHER');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'CORE', 'GLUTES', 'LEGS', 'FULL_BODY');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "category" "ExerciseCategory" NOT NULL,
    "equipment" "ExerciseEquipment" NOT NULL,
    "muscleGroups" "MuscleGroup"[] NOT NULL DEFAULT ARRAY[]::"MuscleGroup"[],
    "notes" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_userId_normalizedName_key" ON "Exercise"("userId", "normalizedName");

-- CreateIndex
CREATE INDEX "Exercise_userId_archivedAt_category_idx" ON "Exercise"("userId", "archivedAt", "category");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
