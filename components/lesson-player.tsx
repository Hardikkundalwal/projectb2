"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, CircleStop, Headphones, Languages, Mic, RotateCcw, Sparkles, Volume2, X } from "lucide-react";
import { MODULES, type CurriculumNode } from "@/lib/curriculum";

type ClientExercise = { id: string; prompt: string; options: string[]; explanation: string; errorCode: string };
type ClientLesson = {
  node: CurriculumNode; goal: string; englishHelp: string; principle: string; explanation: string;
  examples: { label: string; text: string }[]; exercises: ClientExercise[]; repair: string; recap: string[];
  listeningScript?: string; speakingPrompt?: string; writingPrompt?: string;
};
type Result = { correct: boolean; correctIndex: number; explanation: string; progress?: { state?: string; score?: number } };
type WritingFeedback = { mode: "deterministic" | "ai"; scores: Record<string, number>; strengths: string[]; corrections: { original: string; suggestion: string; reason: string }[]; nextSteps: string[]; summary: string; error?: never } | { error: string; mode?: never; scores?: never; strengths?: never; corrections?: never; nextSteps?: never; summary?: never };

export function LessonPlayer({ lesson, nextNodeId }: { lesson: ClientLesson; nextNodeId: string | null }) {
  const [english, setEnglish] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const [saving, setSaving] = useState("");
  const [plays, setPlays] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const moduleConfig = MODULES[lesson.node.module];

  async function submitExercise(exercise: ClientExercise) {
    const answerIndex = answers[exercise.id];
    if (answerIndex === undefined) return;
    setSaving(exercise.id);
    try {
      const response = await fetch("/api/attempts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientAttemptId: crypto.randomUUID(), nodeId: lesson.node.id, exerciseId: exercise.id, answerIndex }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResults((current) => ({ ...current, [exercise.id]: data }));
    } catch (error) {
      setResults((current) => ({ ...current, [exercise.id]: { correct: false, correctIndex: -1, explanation: error instanceof Error ? error.message : "Speichern fehlgeschlagen." } }));
    } finally { setSaving(""); }
  }

  function playListening() {
    if (!lesson.listeningScript || plays >= 1 || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(lesson.listeningScript);
    utterance.lang = "de-DE"; utterance.rate = 0.94;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setPlays((count) => count + 1);
  }

  async function toggleRecording() {
    if (recording && recorder.current) { recorder.current.stop(); setRecording(false); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
    mediaRecorder.onstop = () => { const blob = new Blob(chunks.current, { type: mediaRecorder.mimeType }); setRecordingUrl(URL.createObjectURL(blob)); stream.getTracks().forEach((track) => track.stop()); };
    recorder.current = mediaRecorder; mediaRecorder.start(); setRecording(true);
  }

  async function requestWritingFeedback(useAi: boolean) {
    setFeedbackLoading(true); setFeedback(null);
    try {
      const response = await fetch("/api/writing-feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: draft, task: lesson.writingPrompt, nodeId: lesson.node.id, useAi }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error); setFeedback(data);
    } catch (error) { setFeedback({ error: error instanceof Error ? error.message : "Feedback nicht verfügbar." }); }
    finally { setFeedbackLoading(false); }
  }

  const completed = Object.values(results).filter((result) => result.correct).length;
  return (
    <article className="lesson-page" style={{ "--line": moduleConfig.color } as React.CSSProperties}>
      <header className="lesson-head">
        <Link href="/" className="back-link">Lernnetz</Link>
        <div className="lesson-route"><span>{moduleConfig.label}</span><i /><span>{lesson.node.id}</span><i /><span>{lesson.node.lesson_minutes} Min.</span></div>
        <h1>{lesson.node.title}</h1>
        <p>{lesson.goal}</p>
        <button className="language-toggle" onClick={() => setEnglish(!english)} aria-pressed={english}><Languages size={17} /> {english ? "English help ausblenden" : "English help"}</button>
        {english && <div className="english-help">{lesson.englishHelp}</div>}
      </header>

      <section className="lesson-section principle-card"><span className="section-number">A</span><div><h2>Kernidee</h2><p className="lead">{lesson.principle}</p><p>{lesson.explanation}</p></div></section>
      <section className="lesson-section"><span className="section-number">B</span><div><h2>Beispiel und Kontrast</h2><div className="example-grid">{lesson.examples.map((example) => <div key={example.label}><strong>{example.label}</strong><p>{example.text}</p></div>)}</div></div></section>

      {lesson.listeningScript && <section className="media-practice"><div className="media-icon"><Headphones /></div><div><h2>Einmal hören</h2><p>Lies zuerst die Aufgabe: Welcher Termin gilt endgültig, und was soll mitgebracht werden?</p><button className="secondary-action" onClick={playListening} disabled={plays >= 1}><Volume2 size={17} /> {plays ? "Audio abgespielt" : "Audio abspielen"}</button><button className="text-action" onClick={() => setShowTranscript(!showTranscript)}>{showTranscript ? "Transkript schließen" : "Nach dem Versuch: Transkript"}</button>{showTranscript && <p className="transcript">{lesson.listeningScript}</p>}</div></section>}
      {lesson.speakingPrompt && <section className="media-practice"><div className="media-icon"><Mic /></div><div><h2>Sprechtraining</h2><p>{lesson.speakingPrompt}</p><button className={`secondary-action ${recording ? "danger" : ""}`} onClick={toggleRecording}>{recording ? <CircleStop size={17} /> : <Mic size={17} />}{recording ? "Aufnahme stoppen" : "Lokal aufnehmen"}</button>{recordingUrl && <audio controls src={recordingUrl} className="audio-player" />}<small>Die Aufnahme bleibt nur in diesem Browser-Tab und wird nicht hochgeladen.</small></div></section>}

      <section className="lesson-section practice"><span className="section-number">C</span><div><h2>Drei Prüfungen</h2><p>Wähle jeweils eine Antwort. Die Lösung wird erst auf dem Server geprüft.</p><div className="exercise-list">{lesson.exercises.map((exercise, exerciseIndex) => {
        const result = results[exercise.id];
        return <fieldset key={exercise.id} className={`exercise ${result ? result.correct ? "correct" : "incorrect" : ""}`}><legend><span>{exerciseIndex + 1}</span>{exercise.prompt}</legend>{exercise.options.map((option, optionIndex) => <label key={option}><input type="radio" name={exercise.id} checked={answers[exercise.id] === optionIndex} onChange={() => !result && setAnswers((current) => ({ ...current, [exercise.id]: optionIndex }))} disabled={Boolean(result)} /><span>{option}</span>{result && optionIndex === result.correctIndex && <Check size={18} />}{result && answers[exercise.id] === optionIndex && !result.correct && <X size={18} />}</label>)}{!result ? <button className="check-action" disabled={answers[exercise.id] === undefined || saving === exercise.id} onClick={() => submitExercise(exercise)}>{saving === exercise.id ? "Prüfe …" : "Antwort prüfen"}</button> : <div className="exercise-feedback"><strong>{result.correct ? "Richtig" : "Noch nicht"}</strong><p>{result.explanation}</p></div>}</fieldset>;
      })}</div></div></section>

      {lesson.writingPrompt && <section className="writing-lab"><div className="writing-head"><div><h2>Schreiblabor</h2><p>{lesson.writingPrompt}</p></div><span>{draft.trim() ? draft.trim().split(/\s+/).length : 0} Wörter</span></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Schreibe deinen Text hier …" rows={12} /><div className="writing-actions"><button className="secondary-action" disabled={feedbackLoading || draft.length < 40} onClick={() => requestWritingFeedback(false)}><Check size={17} /> Rubrik prüfen</button><button className="secondary-action ai" disabled={feedbackLoading || draft.length < 40} onClick={() => requestWritingFeedback(true)}><Sparkles size={17} /> Optionales KI-Feedback</button></div>{feedback && <FeedbackPanel feedback={feedback} />}</section>}

      <section className="repair-card"><RotateCcw size={20} /><div><h2>Reparaturweg</h2><p>{lesson.repair}</p></div></section>
      <section className="recap"><h2>Zum Mitnehmen</h2><ul>{lesson.recap.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <footer className="lesson-footer"><span>{completed} von 3 Übungen richtig</span>{nextNodeId ? <Link className="primary-action" href={`/lernen/${nextNodeId}`}>Nächste Station</Link> : <Link className="primary-action" href="/pruefungsreife">Prüfungsreife ansehen</Link>}</footer>
    </article>
  );
}

function FeedbackPanel({ feedback }: { feedback: WritingFeedback }) {
  if (feedback.error) return <div className="notice error">{feedback.error}</div>;
  const labels: Record<string, string> = { taskFulfilment: "Aufgabe", organisation: "Struktur", vocabulary: "Wortschatz", grammar: "Grammatik", register: "Register" };
  return <div className="feedback-panel"><div className="feedback-title"><strong>{feedback.mode === "ai" ? "KI-Feedback" : "Lokale Rubrikprüfung"}</strong><span>Übungseinschätzung</span></div><p>{feedback.summary}</p><div className="rubric-bars">{Object.entries(feedback.scores).map(([key, value]) => <div key={key}><span>{labels[key] ?? key}</span><div><i style={{ width: `${Number(value) * 20}%` }} /></div><strong>{String(value)}/5</strong></div>)}</div><div className="feedback-columns"><div><h3>Stärken</h3><ul>{feedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3>Nächste Schritte</h3><ul>{feedback.nextSteps.map((item) => <li key={item}>{item}</li>)}</ul></div></div>{feedback.corrections.length > 0 && <div><h3>Korrekturen</h3>{feedback.corrections.map((item) => <p key={item.original}><s>{item.original}</s> · <strong>{item.suggestion}</strong> · {item.reason}</p>)}</div>}</div>;
}
