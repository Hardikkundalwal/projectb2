import { getLearnerIdentity } from "@/lib/identity";
import { submitCheckpoint } from "@/lib/firebase-store";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: string; correct?: number; total?: number };
    if (!body.sessionId || !body.total) return Response.json({ error: "Checkpoint ist unvollständig." }, { status: 400 });
    return Response.json(await submitCheckpoint(await getLearnerIdentity(), body.sessionId, Number(body.correct ?? 0), body.total));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkpoint konnte nicht abgeschlossen werden." }, { status: 500 });
  }
}
