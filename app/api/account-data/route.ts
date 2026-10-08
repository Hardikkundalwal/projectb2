import { getLearnerIdentity } from "@/lib/identity";
import { readProgress } from "@/lib/progress";
import { deleteLearnerData, updatePreferences } from "@/lib/firebase-store";

export async function GET() {
  try { return Response.json(await readProgress(await getLearnerIdentity())); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Datenexport nicht verfügbar." }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  try {
    const identity = await getLearnerIdentity();
    const body = await request.json() as { englishHelp?: boolean; aiWritingEnabled?: boolean };
    await updatePreferences(identity, body);
    return Response.json({ saved: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Einstellungen konnten nicht gespeichert werden." }, { status: 500 }); }
}

export async function DELETE() {
  try {
    const identity = await getLearnerIdentity();
    await deleteLearnerData(identity);
    return Response.json({ deleted: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Daten konnten nicht gelöscht werden." }, { status: 500 }); }
}
