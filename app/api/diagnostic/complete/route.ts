import { getDb } from "@/db";
import { assessmentSessions, mastery } from "@/db/schema";
import { CURRICULUM_NODES } from "@/lib/curriculum";
import { getLearnerIdentity } from "@/lib/identity";
import { ensureProfile } from "@/lib/progress";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { answers?: boolean[] };
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const identity = await getLearnerIdentity();
    await ensureProfile(identity);
    const score = answers.length ? answers.filter(Boolean).length / answers.length : 0;
    const sessionId = crypto.randomUUID();
    const db = getDb();
    const foundationTargets = CURRICULUM_NODES.filter((node) => node.module === "foundation").slice(0, Math.floor(score * 6));
    await db.batch([
      db.insert(assessmentSessions).values({ id: sessionId, userId: identity.userId, kind: "diagnostic", score, status: "completed", payload: JSON.stringify({ answers }), completedAt: new Date().toISOString() }),
      ...foundationTargets.map((node) => db.insert(mastery).values({ userId: identity.userId, nodeId: node.id, state: "practiced", score: 0.75, observations: 2, transferSeen: false }).onConflictDoNothing()),
    ]);
    return Response.json({ sessionId, score, recommendedNodeId: score > 0.7 ? "RDG-001" : "FND-003" });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Diagnose konnte nicht gespeichert werden." }, { status: 500 });
  }
}
