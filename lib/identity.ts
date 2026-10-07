import { headers } from "next/headers";

export type LearnerIdentity = { userId: string; email: string | null; displayName: string };

export async function getLearnerIdentity(): Promise<LearnerIdentity> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get("oai-authenticated-user-id");
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedName = requestHeaders.get("oai-authenticated-user-full-name");
  const encoding = requestHeaders.get("oai-authenticated-user-full-name-encoding");
  let fullName: string | null = null;
  if (encodedName && encoding === "percent-encoded-utf-8") {
    try { fullName = decodeURIComponent(encodedName); } catch { fullName = null; }
  }
  if (userId) return { userId, email, displayName: fullName ?? email ?? "Lernprofil" };
  return { userId: "local-seeded-learner", email: null, displayName: "Lokales Lernprofil" };
}
