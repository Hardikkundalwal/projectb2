import { scoreExercise } from "@/lib/curriculum";
import { getLearnerIdentity } from "@/lib/identity";
import { recordAttempt } from "@/lib/progress";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { clientAttemptId?: string; nodeId?: string; exerciseId?: string; answerIndex?: number };
    if (!body.clientAttemptId || !body.nodeId || !body.exerciseId || !Number.isInteger(body.answerIndex)) {
      return Response.json({ error: "Der Versuch ist unvollständig." }, { status: 400 });
    }
    const scored = scoreExercise(body.nodeId, body.exerciseId, body.answerIndex!);
    if (!scored) return Response.json({ error: "Aufgabe nicht gefunden." }, { status: 404 });
    const progress = await recordAttempt({ identity: await getLearnerIdentity(), clientAttemptId: body.clientAttemptId, nodeId: body.nodeId, exerciseId: body.exerciseId, answerIndex: body.answerIndex!, correct: scored.correct, errorCode: scored.errorCode });
    return Response.json({ ...scored, progress });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Der Versuch konnte nicht gespeichert werden." }, { status: 500 });
  }
}
