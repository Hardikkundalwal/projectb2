import { getDb } from "@/db";
import { assessmentSessions } from "@/db/schema";
import { getLearnerIdentity } from "@/lib/identity";
import { ensureProfile } from "@/lib/progress";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { module?: string };
    const identity = await getLearnerIdentity();
    await ensureProfile(identity);
    const id = crypto.randomUUID();
    await getDb().insert(assessmentSessions).values({ id, userId: identity.userId, kind: "checkpoint", module: body.module ?? "mixed", status: "started" });
    return Response.json({ sessionId: id, startedAt: new Date().toISOString(), durationMinutes: 12 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkpoint konnte nicht gestartet werden." }, { status: 500 });
  }
}
