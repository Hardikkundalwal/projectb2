import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { aiFeedbackRuns, assessmentSessions, attempts, mastery, profiles, reviewQueue, rubricScores } from "@/db/schema";
import { getLearnerIdentity } from "@/lib/identity";
import { readProgress } from "@/lib/progress";

export async function GET() {
  try { return Response.json(await readProgress(await getLearnerIdentity())); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Datenexport nicht verfügbar." }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  try {
    const identity = await getLearnerIdentity();
    const body = await request.json() as { englishHelp?: boolean; aiWritingEnabled?: boolean };
    await getDb().update(profiles).set({ englishHelp: body.englishHelp, aiWritingEnabled: body.aiWritingEnabled, updatedAt: new Date().toISOString() }).where(eq(profiles.userId, identity.userId));
    return Response.json({ saved: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Einstellungen konnten nicht gespeichert werden." }, { status: 500 }); }
}

export async function DELETE() {
  try {
    const identity = await getLearnerIdentity();
    const db = getDb();
    await db.batch([
      db.delete(aiFeedbackRuns).where(eq(aiFeedbackRuns.userId, identity.userId)),
      db.delete(rubricScores).where(eq(rubricScores.userId, identity.userId)),
      db.delete(assessmentSessions).where(eq(assessmentSessions.userId, identity.userId)),
      db.delete(reviewQueue).where(eq(reviewQueue.userId, identity.userId)),
      db.delete(mastery).where(eq(mastery.userId, identity.userId)),
      db.delete(attempts).where(eq(attempts.userId, identity.userId)),
      db.delete(profiles).where(eq(profiles.userId, identity.userId)),
    ]);
    return Response.json({ deleted: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Daten konnten nicht gelöscht werden." }, { status: 500 }); }
}
