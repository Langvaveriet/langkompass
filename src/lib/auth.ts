import { timingSafeEqual } from "node:crypto";

import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";

const localUserEmail = "local-user@langkompass.invalid";
const developmentSecret =
  "langkompass-development-secret-not-for-production";

export const authOrigin =
  process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

function isValidSetupToken(context?: string | null): boolean {
  const expectedToken = process.env.PASSKEY_SETUP_TOKEN;

  if (!context || !expectedToken) {
    return false;
  }

  const actual = Buffer.from(context);
  const expected = Buffer.from(expectedToken);

  return (
    actual.length === expected.length && timingSafeEqual(actual, expected)
  );
}

export const auth = betterAuth({
  appName: "LångKompass",
  baseURL: authOrigin,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    (process.env.NODE_ENV === "production" ? undefined : developmentSecret),
  trustedOrigins: [authOrigin],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    passkey({
      rpID: new URL(authOrigin).hostname,
      rpName: "LångKompass",
      origin: authOrigin,
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
      registration: {
        requireSession: false,
        resolveUser: async ({ context }) => {
          if (!isValidSetupToken(context)) {
            throw new Error("Ungültiger oder fehlender Einrichtungsschlüssel.");
          }

          const user = await prisma.user.findUnique({
            where: {
              email:
                process.env.LANGKOMPASS_USER_EMAIL ?? localUserEmail,
            },
            select: {
              id: true,
              name: true,
              email: true,
              passkeys: {
                select: { id: true },
                take: 1,
              },
            },
          });

          const hasExistingPasskey = (user?.passkeys.length ?? 0) > 0;
          const additionalDevelopmentPasskeyAllowed =
            process.env.NODE_ENV !== "production" &&
            new URL(authOrigin).hostname === "localhost";

          if (
            !user ||
            (hasExistingPasskey && !additionalDevelopmentPasskeyAllowed)
          ) {
            throw new Error("Die Passkey-Ersteinrichtung ist nicht verfügbar.");
          }

          return {
            id: user.id,
            name: user.email,
            displayName: user.name,
          };
        },
        afterVerification: async ({ verification }) => {
          if (!verification.registrationInfo?.userVerified) {
            throw new Error("Nutzerverifikation erforderlich.");
          }
        },
      },
      authentication: {
        afterVerification: async ({ verification }) => {
          if (!verification.authenticationInfo.userVerified) {
            throw new Error("Nutzerverifikation erforderlich.");
          }
        },
      },
    }),
  ],
});
