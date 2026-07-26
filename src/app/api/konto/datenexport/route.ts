import { getSession } from "@/lib/session";
import {
  createCsvExport,
  dataExportDatasets,
  loadUserDataExport,
  type DataExportDataset,
} from "@/lib/account/data-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function downloadResponse(body: string, contentType: string, filename: string) {
  return new Response(body, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const data = await loadUserDataExport(session.user.id);

  if (!data) {
    return Response.json({ error: "Benutzerkonto nicht gefunden." }, { status: 404 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";
  const date = new Date().toISOString().slice(0, 10);

  if (format === "json") {
    return downloadResponse(
      `${JSON.stringify(data, null, 2)}\n`,
      "application/json; charset=utf-8",
      `langkompass-datenexport-${date}.json`,
    );
  }

  const dataset = url.searchParams.get("dataset");
  if (format !== "csv" || !dataExportDatasets.includes(dataset as DataExportDataset)) {
    return Response.json({ error: "Unbekanntes Exportformat." }, { status: 400 });
  }

  return downloadResponse(
    createCsvExport(dataset as DataExportDataset, data),
    "text/csv; charset=utf-8",
    `langkompass-${dataset}-${date}.csv`,
  );
}
