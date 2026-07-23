"use client";

import { startAuthentication } from "@simplewebauthn/browser";

type AuthenticationOptions = Parameters<
  typeof startAuthentication
>[0]["optionsJSON"];

export async function signInWithVerifiedPasskey(): Promise<boolean> {
  const optionsResponse = await fetch(
    "/api/auth/passkey/generate-authenticate-options",
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!optionsResponse.ok) {
    return false;
  }

  const options = (await optionsResponse.json()) as AuthenticationOptions;
  const credential = await startAuthentication({
    optionsJSON: {
      ...options,
      userVerification: "required",
    },
  });
  const { clientExtensionResults, ...response } = credential;
  void clientExtensionResults;

  const verificationResponse = await fetch(
    "/api/auth/passkey/verify-authentication",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    },
  );

  return verificationResponse.ok;
}
