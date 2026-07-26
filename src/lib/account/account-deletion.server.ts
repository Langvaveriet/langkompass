import "server-only";

import { prisma } from "@/lib/prisma";

export async function deleteUserAccount(userId: string): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    await transaction.supplementIntakeRevision.deleteMany({ where: { userId } });
    await transaction.supplementIntake.deleteMany({ where: { userId } });
    await transaction.supplementIngredient.deleteMany({ where: { userId } });
    await transaction.supplement.deleteMany({ where: { userId } });

    await transaction.labResultRevision.deleteMany({ where: { userId } });
    await transaction.labResult.deleteMany({ where: { userId } });
    await transaction.labReport.deleteMany({ where: { userId } });
    await transaction.labReferenceRange.deleteMany({ where: { userId } });

    await transaction.trainingSet.deleteMany({ where: { userId } });
    await transaction.trainingPlanExercise.deleteMany({ where: { userId } });
    await transaction.trainingSession.deleteMany({ where: { userId } });
    await transaction.trainingPlan.deleteMany({ where: { userId } });
    await transaction.exercise.deleteMany({ where: { userId } });

    await transaction.mealPlanEntry.deleteMany({ where: { userId } });
    await transaction.recipeItem.deleteMany({ where: { userId } });
    await transaction.recipe.deleteMany({ where: { userId } });
    await transaction.shoppingListItemState.deleteMany({ where: { userId } });

    await transaction.bodyMeasurement.deleteMany({ where: { userId } });
    await transaction.dailyEntry.deleteMany({ where: { userId } });
    await transaction.healthProfile.deleteMany({ where: { userId } });
    await transaction.userSettings.deleteMany({ where: { userId } });

    await transaction.passkey.deleteMany({ where: { userId } });
    await transaction.session.deleteMany({ where: { userId } });
    await transaction.account.deleteMany({ where: { userId } });
    await transaction.user.delete({ where: { id: userId } });
  });
}
