export type ProgressState = {
  completedConceptIds: string[];
  quizScores: Record<string, number>;
};

const STORAGE_KEY = "phy-app-progress";

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { completedConceptIds: [], quizScores: {} };
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return { completedConceptIds: [], quizScores: {} };
    }

    return JSON.parse(rawValue) as ProgressState;
  } catch {
    return { completedConceptIds: [], quizScores: {} };
  }
}

export function saveProgress(progress: ProgressState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
