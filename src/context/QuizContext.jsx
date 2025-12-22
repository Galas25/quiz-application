import { createContext, useState, useEffect } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);
  const [violations, setViolations] = useState(0);

  // 1. IMPROVED INITIALIZATION: Grab data immediately from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      return parsed.name || parsed; // Handles both object and string formats
    } catch {
      return savedUser;
    }
  });

  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem("results");
    return savedResults ? JSON.parse(savedResults) : [];
  });

  const [released, setReleased] = useState(() => {
    return localStorage.getItem("released") === "true";
  });

  // 2. Load quiz questions (Keep this as is)
  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuizData(data))
      .catch(err => console.error("Error loading questions:", err));
  }, []);

  // 3. PERSISTENCE: Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    if (currentUser) {
      // Consistency check: ensure we store it in a way that the initializer above likes
      localStorage.setItem("currentUser", JSON.stringify({ name: currentUser }));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("released", released.toString());
  }, [released]);

  // --- Functions (logViolation, submitQuiz, releaseScores) ---
  // You can keep these exactly as they are in your original code!

  const logViolation = () => {
    let updatedCount;
    setViolations(v => {
      updatedCount = v + 1;
      return updatedCount;
    });
    return updatedCount;
  };

  const submitQuiz = (answers, name) => {
    const studentName = name || currentUser || "Student";
    const finalViolations = violations;

    const newResults = [
      ...results,
      {
        name: studentName,
        answers,
        timestamp: Date.now(),
        violations: finalViolations
      }
    ];

    setResults(newResults);
    localStorage.setItem("quizTaken", "true");
    setViolations(0);
  };

  const releaseScores = () => {
    setReleased(true);
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        currentUser,
        setCurrentUser,
        results,
        setResults,
        violations,
        logViolation,
        submitQuiz,
        released,
        releaseScores,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};