import { getLearnerIdentity } from "@/lib/identity";
import { completeDiagnostic } from "@/lib/firebase-store";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { answers?: boolean[] };
    const answers = Array.isArray(body.answers) ? body.answers : [];
    return Response.json(await completeDiagnostic(await getLearnerIdentity(), answers));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Diagnose konnte nicht gespeichert werden." }, { status: 500 });
  }
}
