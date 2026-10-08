import { getLearnerIdentity } from "@/lib/identity";
import { startCheckpoint } from "@/lib/firebase-store";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { module?: string };
    return Response.json(await startCheckpoint(await getLearnerIdentity(), body.module ?? "mixed"));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkpoint konnte nicht gestartet werden." }, { status: 500 });
  }
}
