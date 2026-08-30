import {staticFile} from 'remotion';
import type {Question, QuestionTiming} from './types';

const getJson = async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
  const res = await fetch(staticFile(path), {signal});
  if (!res.ok) {
    throw new Error(
      `Could not read ${path} (HTTP ${res.status}). Run "npm run tts -- all" first.`,
    );
  }
  return (await res.json()) as T;
};

export const loadQuestion = (id: string, signal?: AbortSignal) =>
  getJson<Question>(`data/${id}.json`, signal);

export const loadTiming = (id: string, signal?: AbortSignal) =>
  getJson<QuestionTiming>(`audio/${id}/timing.json`, signal);

export const loadPair = async (id: string, signal?: AbortSignal) => {
  const [question, timing] = await Promise.all([
    loadQuestion(id, signal),
    loadTiming(id, signal),
  ]);
  return {question, timing};
};
