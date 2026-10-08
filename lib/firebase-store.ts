import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { CONTENT_VERSION, CURRICULUM_NODES, getNode } from "@/lib/curriculum";
import type { LearnerIdentity } from "@/lib/identity";

const app = getApps()[0] ?? initializeApp({ credential: applicationDefault() });
const firestore = getFirestore(app);

function learner(identity: LearnerIdentity) {
  return firestore.collection("learners").doc(identity.userId);
}

export async function ensureProfile(identity: LearnerIdentity) {
  await learner(identity).set({
    email: identity.email,
    displayName: "Lernprofil",
    contentVersion: CONTENT_VERSION,
    updatedAt: new Date().toISOString(),
    createdAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function readProgress(identity: LearnerIdentity) {
  await ensureProfile(identity);
  const root = learner(identity);
  const [masterySnapshot, reviewSnapshot, attemptSnapshot] = await Promise.all([
    root.collection("mastery").get(),
    root.collection("reviews").where("dueAt", "<=", new Date().toISOString()).orderBy("dueAt").get(),
    root.collection("attempts").count().get(),
  ]);
  const masteryRows = masterySnapshot.docs.map((doc) => ({ nodeId: doc.id, ...doc.data() })) as Array<{ nodeId: string; state?: string; score?: number; observations?: number }>;
  const byId = new Map(masteryRows.map((row) => [row.nodeId, row]));
  const nodes = CURRICULUM_NODES.map((node) => {
    const row = byId.get(node.id);
    const unlocked = node.prerequisites.every((id) => byId.get(id)?.state === "mastered");
    return { id: node.id, state: row?.state ?? "unseen", score: row?.score ?? 0, observations: row?.observations ?? 0, unlocked: node.prerequisites.length === 0 || unlocked };
  });
  return {
    profile: { displayName: "Lernprofil" }, nodes,
    reviews: reviewSnapshot.docs.map((doc) => ({ nodeId: doc.id, ...doc.data() })),
    attemptCount: attemptSnapshot.data().count,
    mastered: nodes.filter((node) => node.state === "mastered").length,
    total: CURRICULUM_NODES.length,
  };
}

export async function recordAttempt(input: { identity: LearnerIdentity; clientAttemptId: string; nodeId: string; exerciseId: string; answerIndex: number; correct: boolean; errorCode: string | null }) {
  if (!getNode(input.nodeId)) throw new Error("Unbekannte Lernstation");
  await ensureProfile(input.identity);
  const root = learner(input.identity);
  const attemptRef = root.collection("attempts").doc(input.clientAttemptId);
  const masteryRef = root.collection("mastery").doc(input.nodeId);
  const reviewRef = root.collection("reviews").doc(input.nodeId);
  return firestore.runTransaction(async (transaction) => {
    const [attemptDoc, previousDoc] = await Promise.all([transaction.get(attemptRef), transaction.get(masteryRef)]);
    if (attemptDoc.exists) return { duplicate: true, attempt: attemptDoc.data() };
    const previous = previousDoc.data();
    const observations = Number(previous?.observations ?? 0) + 1;
    const oldScore = Number(previous?.score ?? 0);
    const score = Number((((oldScore * (observations - 1)) + (input.correct ? 1 : 0)) / observations).toFixed(3));
    const isTransfer = input.exerciseId.endsWith("EX-3");
    const transferSeen = Boolean(previous?.transferSeen || (isTransfer && input.correct));
    const state = score >= 0.8 && observations >= 3 && transferSeen ? "mastered" : score >= 0.65 ? "practiced" : "learning";
    const now = new Date().toISOString();
    const dueAt = new Date(Date.now() + (input.correct ? 3 : 1) * 86_400_000).toISOString();
    const attemptData = { clientAttemptId: input.clientAttemptId, nodeId: input.nodeId, exerciseId: input.exerciseId, answerIndex: input.answerIndex, correct: input.correct, errorCode: input.errorCode };
    transaction.create(attemptRef, { ...attemptData, score: input.correct ? 1 : 0, isTransfer, createdAt: now });
    transaction.set(masteryRef, { state, score, observations, transferSeen, updatedAt: now }, { merge: true });
    transaction.set(reviewRef, { intervalStep: input.correct ? 1 : 0, dueAt, reason: input.correct ? "retrieval" : "repair", updatedAt: now });
    return { duplicate: false, state, score, observations };
  });
}

export async function completeDiagnostic(identity: LearnerIdentity, answers: boolean[]) {
  await ensureProfile(identity);
  const score = answers.length ? answers.filter(Boolean).length / answers.length : 0;
  const sessionId = crypto.randomUUID();
  const root = learner(identity);
  const batch = firestore.batch();
  batch.set(root.collection("assessments").doc(sessionId), { kind: "diagnostic", score, status: "completed", payload: { answers }, completedAt: new Date().toISOString() });
  for (const node of CURRICULUM_NODES.filter((item) => item.module === "foundation").slice(0, Math.floor(score * 6))) {
    batch.set(root.collection("mastery").doc(node.id), { state: "practiced", score: 0.75, observations: 2, transferSeen: false, updatedAt: new Date().toISOString() }, { merge: true });
  }
  await batch.commit();
  return { sessionId, score, recommendedNodeId: score > 0.7 ? "RDG-001" : "FND-003" };
}

export async function startCheckpoint(identity: LearnerIdentity, module: string) {
  await ensureProfile(identity);
  const id = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  await learner(identity).collection("assessments").doc(id).set({ kind: "checkpoint", module, status: "started", startedAt });
  return { sessionId: id, startedAt, durationMinutes: 12 };
}

export async function submitCheckpoint(identity: LearnerIdentity, sessionId: string, correct: number, total: number) {
  const score = Math.max(0, Math.min(1, correct / total));
  await learner(identity).collection("assessments").doc(sessionId).set({ score, status: "completed", completedAt: new Date().toISOString(), payload: { correct, total } }, { merge: true });
  return { score, passed: score >= 0.8, repairRequired: score < 0.8 };
}

export async function getPreferences(identity: LearnerIdentity) {
  await ensureProfile(identity);
  return (await learner(identity).get()).data() ?? {};
}

export async function updatePreferences(identity: LearnerIdentity, values: { englishHelp?: boolean; aiWritingEnabled?: boolean }) {
  await ensureProfile(identity);
  await learner(identity).set({ ...values, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteLearnerData(identity: LearnerIdentity) {
  await firestore.recursiveDelete(learner(identity));
}

export async function countTodayFeedback(identity: LearnerIdentity) {
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
  return (await learner(identity).collection("feedbackRuns").where("createdAt", ">=", dayStart.toISOString()).count().get()).data().count;
}

export async function saveFeedback(identity: LearnerIdentity, nodeId: string, feedback: { mode: string; scores: Record<string, number> }) {
  const root = learner(identity);
  const batch = firestore.batch();
  const createdAt = new Date().toISOString();
  batch.set(root.collection("rubricScores").doc(), { nodeId, ...feedback.scores, createdAt });
  batch.set(root.collection("feedbackRuns").doc(), { nodeId, model: feedback.mode === "ai" ? "gpt-6-luna" : "deterministic-v1", promptVersion: "writing-b2-v1", status: "success", createdAt });
  await batch.commit();
}
