import { sql } from "drizzle-orm";
import { index, integer, primaryKey, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email"),
  displayName: text("display_name").notNull().default("Lokales Profil"),
  contentVersion: text("content_version").notNull(),
  englishHelp: integer("english_help", { mode: "boolean" }).notNull().default(true),
  aiWritingEnabled: integer("ai_writing_enabled", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const attempts = sqliteTable("attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientAttemptId: text("client_attempt_id").notNull(),
  userId: text("user_id").notNull(),
  nodeId: text("node_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  answerIndex: integer("answer_index").notNull(),
  correct: integer("correct", { mode: "boolean" }).notNull(),
  score: real("score").notNull(),
  isTransfer: integer("is_transfer", { mode: "boolean" }).notNull().default(false),
  errorCode: text("error_code"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("attempt_client_id_unique").on(table.clientAttemptId), index("attempt_user_node_idx").on(table.userId, table.nodeId)]);

export const mastery = sqliteTable("mastery", {
  userId: text("user_id").notNull(),
  nodeId: text("node_id").notNull(),
  state: text("state", { enum: ["unseen", "learning", "practiced", "mastered", "review_due"] }).notNull().default("unseen"),
  score: real("score").notNull().default(0),
  observations: integer("observations").notNull().default(0),
  transferSeen: integer("transfer_seen", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [primaryKey({ columns: [table.userId, table.nodeId] })]);

export const reviewQueue = sqliteTable("review_queue", {
  userId: text("user_id").notNull(),
  nodeId: text("node_id").notNull(),
  intervalStep: integer("interval_step").notNull().default(0),
  dueAt: text("due_at").notNull(),
  reason: text("reason").notNull().default("practice"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [primaryKey({ columns: [table.userId, table.nodeId] }), index("review_due_idx").on(table.userId, table.dueAt)]);

export const assessmentSessions = sqliteTable("assessment_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  module: text("module"),
  score: real("score"),
  status: text("status").notNull().default("started"),
  payload: text("payload").notNull().default("{}"),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});

export const rubricScores = sqliteTable("rubric_scores", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  sessionId: text("session_id"),
  nodeId: text("node_id").notNull(),
  taskFulfilment: integer("task_fulfilment").notNull(),
  organisation: integer("organisation").notNull(),
  vocabulary: integer("vocabulary").notNull(),
  grammar: integer("grammar").notNull(),
  registerScore: integer("register_score").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const aiFeedbackRuns = sqliteTable("ai_feedback_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  nodeId: text("node_id").notNull(),
  model: text("model").notNull(),
  promptVersion: text("prompt_version").notNull(),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
