// Curriculum helper - generates consistent lesson objects
export function makeLesson(data) {
  return {
    objectives: [],
    theory: "",
    keyConcepts: [],
    examples: [],
    summary: "",
    activity: "",
    notes: "",
    videoUrl: "",
    videoTitle: "",
    relatedLessons: [],
    ...data
  };
}

export function makeQuiz(questions) {
  return questions.map(q => {
    if (q.type === 'mcq') {
      return { ...q, options: q.options || [] };
    }
    return q;
  });
}

// Shuffle utility for quiz randomization
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get a random subset of questions for a quiz attempt
export function getRandomQuiz(questions, count = 10) {
  return shuffle(questions).slice(0, Math.min(count, questions.length));
}
