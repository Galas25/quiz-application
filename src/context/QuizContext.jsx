import { createContext, useState, useEffect } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);
  const [violations, setViolations] = useState(0);

  // 1. Initialize currentUser
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      return parsed.name || parsed;
    } catch {
      return savedUser;
    }
  });

  // 2. Initialize results
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem("results");
    return savedResults ? JSON.parse(savedResults) : [];
  });

  // 3. Initialize release status
  const [released, setReleased] = useState(() => {
    return localStorage.getItem("released") === "true";
  });

  // 4. Load questions
  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuizData(data))
      .catch(err => console.error("Error loading questions:", err));
  }, []);

  // 5. Persistence Effects
  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("released", released.toString());
  }, [released]);

  // --- FUNCTIONS ---

  const logViolation = () => {
    setViolations(prev => prev + 1);
  };

  const submitQuiz = (answers, name, subject = "General Quiz") => {
    const studentName = name || currentUser || "Student";

    // Use the current value of 'violations' state
    const newEntry = {
      name: studentName,
      subject: subject,
      answers,
      timestamp: Date.now(),
      violations: violations
    };

    setResults(prevResults => [...prevResults, newEntry]);

    // Reset violations ONLY after submitting
    setViolations(0);
    localStorage.setItem("quizTaken", "true");
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