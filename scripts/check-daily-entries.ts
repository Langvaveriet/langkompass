import "dotenv/config";

import { prisma } from "../src/lib/prisma";

async function main() {
  const entries = await prisma.dailyEntry.findMany({
    orderBy: {
      entryDate: "desc",
    },
    take: 10,
    select: {
      entryDate: true,
      wellbeing: true,
      energy: true,
      sleepHours: true,
      sleepQuality: true,
      painLevel: true,
      stressLevel: true,
      symptoms: true,
      notes: true,
    },
  });

  console.log({
    database: "verbunden",
    dailyEntries: entries.length,
    entries,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
