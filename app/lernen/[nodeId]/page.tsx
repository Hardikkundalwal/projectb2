import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { getClientLesson, getNextNode } from "@/lib/curriculum";
export default async function LearnPage({ params }: { params: Promise<{ nodeId: string }> }) { const { nodeId } = await params; const lesson = getClientLesson(nodeId); if (!lesson) notFound(); return <LessonPlayer lesson={lesson} nextNodeId={getNextNode(nodeId)?.id ?? null} />; }
