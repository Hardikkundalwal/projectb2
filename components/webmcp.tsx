"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Document { modelContext?: { registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }
}

export function WebMcpTools() {
  const router = useRouter();
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool({ name: "get_learning_status", title: "Lernstatus lesen", description: "Liest den aktuellen Project-B2 Lernfortschritt und fällige Wiederholungen.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: async () => { const response = await fetch("/api/progress"); return response.json(); } }, { signal: lifecycle.signal });
      await context.registerTool({ name: "open_next_activity", title: "Nächste Lernstation öffnen", description: "Öffnet die nächste verfügbare Project-B2 Lernstation in der sichtbaren Oberfläche.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: async () => { const progress = await fetch("/api/progress").then((res) => res.json()) as { nodes?: { id: string; unlocked: boolean; state: string }[] }; const next = progress.nodes?.find((node) => node.unlocked && node.state !== "mastered")?.id ?? "FND-001"; router.push(`/lernen/${next}`); return { opened: next }; } }, { signal: lifecycle.signal });
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, [router]);
  return null;
}
