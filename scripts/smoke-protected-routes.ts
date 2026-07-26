const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const protectedRoutes = [
  "/",
  "/gesundheitsprofil",
  "/tageserfassung",
  "/training",
  "/training/plaene",
  "/training/verlauf",
  "/ernaehrung",
  "/ernaehrung/rezepte",
  "/ernaehrung/wochenplan",
  "/ernaehrung/einkaufsliste",
  "/laborwerte",
  "/supplemente",
  "/supplemente/verlauf",
  "/compass-ai",
  "/berichte/arzt",
  "/einstellungen",
  "/konto/sicherheit",
] as const;

const protectedApiRoutes = ["/api/konto/datenexport?format=json"] as const;

async function request(path: string) {
  return fetch(new URL(path, baseUrl), {
    redirect: "manual",
    headers: {
      accept: "text/html",
    },
  });
}

async function main() {
  const [loginResponse, healthResponse] = await Promise.all([
    request("/anmeldung"),
    request("/api/health"),
  ]);

  if (!loginResponse.ok) {
    throw new Error(
      `Die öffentliche Anmeldung antwortet mit HTTP ${loginResponse.status}.`,
    );
  }

  const health = healthResponse.ok
    ? (await healthResponse.json()) as { status?: string }
    : null;
  if (!healthResponse.ok || health?.status !== "ok") {
    throw new Error(
      `Der technische Betriebsstatus antwortet mit HTTP ${healthResponse.status}.`,
    );
  }

  const failures: string[] = [];

  for (const path of protectedRoutes) {
    const response = await request(path);
    const location = response.headers.get("location");
    const httpRedirectsToLogin =
      response.status >= 300 &&
      response.status < 400 &&
      location !== null &&
      new URL(location, baseUrl).pathname === "/anmeldung";
    const responseBody = response.status === 200 ? await response.text() : "";
    const streamedRedirectsToLogin = responseBody.includes(
      "NEXT_REDIRECT;replace;/anmeldung;307;",
    );
    const redirectsToLogin =
      httpRedirectsToLogin || streamedRedirectsToLogin;

    if (!redirectsToLogin) {
      failures.push(
        `${path}: HTTP ${response.status}, Ziel ${location ?? "ohne Weiterleitung"}`,
      );
    }
  }

  for (const path of protectedApiRoutes) {
    const response = await request(path);
    if (response.status !== 401) {
      failures.push(`${path}: HTTP ${response.status} statt 401 ohne Sitzung`);
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Nicht ausreichend geschützte Routen:\n${failures.join("\n")}`,
    );
  }

  console.log(
    `Betriebsstatus gesund; ${protectedRoutes.length} geschützte Seiten und ${protectedApiRoutes.length} Export-Endpunkt sind ohne Sitzung sicher gesperrt.`,
  );
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Der Route-Smoke-Test ist fehlgeschlagen.",
  );
  process.exitCode = 1;
});
