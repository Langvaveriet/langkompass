import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const userCount = await prisma.user.count();
  const healthProfileCount = await prisma.healthProfile.count();

  console.log({
    database: "verbunden",
    users: userCount,
    healthProfiles: healthProfileCount,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Datenbankprüfung fehlgeschlagen:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
