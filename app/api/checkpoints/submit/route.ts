import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { assessmentSessions } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: string; correct?: number; total?: number };
    if (!body.sessionId || !body.total) return Response.json({ error: "Checkpoint ist unvollständig." }, { status: 400 });
    const score = Math.max(0, Math.min(1, Number(body.correct ?? 0) / body.total));
    await getDb().update(assessmentSessions).set({ score, status: "completed", completedAt: new Date().toISOString(), payload: JSON.stringify({ correct: body.correct, total: body.total }) }).where(eq(assessmentSessions.id, body.sessionId));
    return Response.json({ score, passed: score >= 0.8, repairRequired: score < 0.8 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkpoint konnte nicht abgeschlossen werden." }, { status: 500 });
  }
}
