"use client";

const LEARNER_KEY = "project-b2-learner-id";

function learnerId() {
  let id = window.localStorage.getItem(LEARNER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(LEARNER_KEY, id);
  }
  return id;
}

export function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("x-project-b2-learner-id", learnerId());
  return fetch(input, { ...init, headers });
}
