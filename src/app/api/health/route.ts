import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      { status: "ok" },
      { status: 200, headers },
    );
  } catch {
    console.error("Der technische Datenbankstatus ist nicht verfügbar.");

    return Response.json(
      { status: "unavailable" },
      { status: 503, headers },
    );
  }
}
