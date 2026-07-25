import "dotenv/config";

import { z } from "zod";

import { prisma } from "../src/lib/prisma";

const emailSchema = z.email();

async function main() {
  const email = emailSchema.parse(process.env.LANGKOMPASS_USER_EMAIL);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      emailVerified: true,
      name: "LångKompass Benutzer",
    },
  });

  console.log("Das lokale Benutzerkonto ist vorbereitet.");
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : "Das lokale Benutzerkonto konnte nicht vorbereitet werden.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
