import { getLearnerIdentity } from "@/lib/identity";
import { readProgress } from "@/lib/progress";

export async function GET() {
  try {
    return Response.json(await readProgress(await getLearnerIdentity()));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Fortschritt ist gerade nicht verfügbar." }, { status: 503 });
  }
}
