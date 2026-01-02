import { createContext, useState, useEffect, useRef } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      return typeof parsed === "string" ? parsed : parsed?.name ?? null;
    } catch {
      return saved;
    }
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("results");
    return saved ? JSON.parse(saved) : {};
  });

  const [released, setReleased] = useState(
    () => localStorage.getItem("released") === "true"
  );

  const [quizData, setQuizData] = useState({});
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const violationRef = useRef({});

  useEffect(() => {
    const subjects = ["astronomy", "earth-science", "honors-earth-science"];
    const loadAll = async () => {
      const data = {};
      for (const sub of subjects) {
        try {
          const res = await fetch(`/questions/${sub}.json`);
          const questions = await res.json();
          data[sub] = questions;
        } catch {
          data[sub] = [];
        }
      }
      setQuizData(data);
      setLoadingSubjects(false);
    };
    loadAll();
  }, []);

  // When quiz data finishes loading, recompute stored scores for any saved results
  useEffect(() => {
    if (loadingSubjects) return;
    setResults((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((subKey) => {
        const questions = quizData[subKey] || [];
        updated[subKey] = (updated[subKey] || []).map((r) => {
          const recomputed = calculateScore(subKey, r.answers);
          return {
            ...r,
            score: recomputed,
            totalQuestions: questions.length || r.totalQuestions || 0,
          };
        });
      });
      return updated;
    });
  }, [loadingSubjects, quizData]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("released", released.toString());
  }, [released]);

  const logViolation = (subject) => {
    const next = (violationRef.current[subject] || 0) + 1;
    violationRef.current[subject] = next;
    return next;
  };

  const calculateScore = (subjectKey, answers) => {
    const questions = quizData[subjectKey] || [];
    if (!questions.length || !answers) return 0;

    return questions.reduce((score, q) => {
      const userAnswer = answers[q.id];
      if (userAnswer === undefined || userAnswer === null) return score;

      // support two formats: stored index (number) or stored option text (string)
      let selectedIndex = -1;
      if (typeof userAnswer === 'number') selectedIndex = Number(userAnswer);
      else selectedIndex = q.options.indexOf(userAnswer);

      return score + (selectedIndex === Number(q.answer) ? 1 : 0);
    }, 0);
  };

  const submitQuiz = (
    subjectKey,
    answers,
    moduleName = "Module 1",
    quizName = "Quiz 1"
  ) => {
    const studentName = currentUser || "Student";

    const ensureAndSave = async () => {
      let questions = quizData[subjectKey] || [];
      if (!questions.length) {
        try {
          const res = await fetch(`/questions/${subjectKey}.json`);
          const qs = await res.json();
          setQuizData((prev) => ({ ...prev, [subjectKey]: qs }));
          questions = qs;
        } catch {
          questions = [];
        }
      }

      const computedScore = questions.length ? calculateScore(subjectKey, answers) : 0;

      setResults((prev) => {
        const updated = { ...prev };
        if (!updated[subjectKey]) updated[subjectKey] = [];
        updated[subjectKey].push({
          id: crypto.randomUUID(),
          name: studentName,
          subject: subjectKey,
          module: moduleName,
          quizName: quizName,
          answers,
          timestamp: Date.now(),
          violations: violationRef.current[subjectKey] || 0,
          score: computedScore,
          totalQuestions: questions.length,
          released: false // <-- now per submission
        });
        return updated;
      });
    };

    ensureAndSave();

    const quizTaken = JSON.parse(localStorage.getItem("quizTakenBySubject") || "{}");
    quizTaken[subjectKey] = true;
    localStorage.setItem("quizTakenBySubject", JSON.stringify(quizTaken));
  };


  const releaseScores = () => setReleased(true);

  return (
    <QuizContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        results,
        submitQuiz,
        logViolation,
        released,
        quizData,
        loadingSubjects,
        releaseScores,
        setResults,
        calculateScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
