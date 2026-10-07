import { and, asc, eq, lte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { attempts, mastery, profiles, reviewQueue } from "@/db/schema";
import { CONTENT_VERSION, CURRICULUM_NODES, getNode } from "@/lib/curriculum";
import type { LearnerIdentity } from "@/lib/identity";

export async function ensureProfile(identity: LearnerIdentity) {
  const db = getDb();
  await db.insert(profiles).values({ userId: identity.userId, email: identity.email, displayName: identity.displayName, contentVersion: CONTENT_VERSION }).onConflictDoUpdate({
    target: profiles.userId,
    set: { email: identity.email, displayName: identity.displayName, contentVersion: CONTENT_VERSION, updatedAt: sql`CURRENT_TIMESTAMP` },
  });
}

export async function readProgress(identity: LearnerIdentity) {
  await ensureProfile(identity);
  const db = getDb();
  const masteryRows = await db.select().from(mastery).where(eq(mastery.userId, identity.userId));
  const reviewRows = await db.select().from(reviewQueue).where(and(eq(reviewQueue.userId, identity.userId), lte(reviewQueue.dueAt, new Date().toISOString()))).orderBy(asc(reviewQueue.dueAt));
  const attemptCount = await db.select({ count: sql<number>`count(*)` }).from(attempts).where(eq(attempts.userId, identity.userId));
  const byId = new Map(masteryRows.map((row) => [row.nodeId, row]));
  const nodes = CURRICULUM_NODES.map((node) => {
    const row = byId.get(node.id);
    const unlocked = node.prerequisites.every((id) => byId.get(id)?.state === "mastered");
    return { id: node.id, state: row?.state ?? "unseen", score: row?.score ?? 0, observations: row?.observations ?? 0, unlocked: node.prerequisites.length === 0 || unlocked };
  });
  const mastered = nodes.filter((node) => node.state === "mastered").length;
  return { profile: identity, nodes, reviews: reviewRows, attemptCount: Number(attemptCount[0]?.count ?? 0), mastered, total: CURRICULUM_NODES.length };
}

export async function recordAttempt(input: { identity: LearnerIdentity; clientAttemptId: string; nodeId: string; exerciseId: string; answerIndex: number; correct: boolean; errorCode: string | null }) {
  const node = getNode(input.nodeId);
  if (!node) throw new Error("Unbekannte Lernstation");
  await ensureProfile(input.identity);
  const db = getDb();
  const existing = await db.select().from(attempts).where(eq(attempts.clientAttemptId, input.clientAttemptId)).limit(1);
  if (existing[0]) return { duplicate: true, attempt: existing[0] };
  const previous = await db.select().from(mastery).where(and(eq(mastery.userId, input.identity.userId), eq(mastery.nodeId, input.nodeId))).limit(1);
  const observations = (previous[0]?.observations ?? 0) + 1;
  const oldScore = previous[0]?.score ?? 0;
  const score = Number((((oldScore * (observations - 1)) + (input.correct ? 1 : 0)) / observations).toFixed(3));
  const isTransfer = input.exerciseId.endsWith("EX-3");
  const transferSeen = Boolean(previous[0]?.transferSeen || (isTransfer && input.correct));
  const state = score >= 0.8 && observations >= 3 && transferSeen ? "mastered" : score >= 0.65 ? "practiced" : "learning";
  const due = new Date(Date.now() + (input.correct ? 3 : 1) * 86_400_000).toISOString();
  await db.batch([
    db.insert(attempts).values({ clientAttemptId: input.clientAttemptId, userId: input.identity.userId, nodeId: input.nodeId, exerciseId: input.exerciseId, answerIndex: input.answerIndex, correct: input.correct, score: input.correct ? 1 : 0, isTransfer, errorCode: input.errorCode }),
    db.insert(mastery).values({ userId: input.identity.userId, nodeId: input.nodeId, state, score, observations, transferSeen }).onConflictDoUpdate({ target: [mastery.userId, mastery.nodeId], set: { state, score, observations, transferSeen, updatedAt: sql`CURRENT_TIMESTAMP` } }),
    db.insert(reviewQueue).values({ userId: input.identity.userId, nodeId: input.nodeId, intervalStep: input.correct ? 1 : 0, dueAt: due, reason: input.correct ? "retrieval" : "repair" }).onConflictDoUpdate({ target: [reviewQueue.userId, reviewQueue.nodeId], set: { intervalStep: input.correct ? 1 : 0, dueAt: due, reason: input.correct ? "retrieval" : "repair", updatedAt: sql`CURRENT_TIMESTAMP` } }),
  ]);
  return { duplicate: false, state, score, observations };
}
