import { createContext, useState, useEffect } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [results, setResults] = useState([]);
  const [violations, setViolations] = useState(0);
  const [released, setReleased] = useState(false);

  // Load quiz questions
  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuizData(data));
  }, []);

  // Load results, released state, and currentUser from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    if (savedResults) setResults(JSON.parse(savedResults));

    const savedReleased = localStorage.getItem("released");
    if (savedReleased === "true") setReleased(true);

    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // Persist results to localStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem("results", JSON.stringify(results));
    }
  }, [results]);

  // Persist currentUser whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", currentUser);
    }
  }, [currentUser]);

  // Log violation and return updated count
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

  const finalViolations = violations;   // capture exact value before reset

  const newResults = [
    ...results,
    { 
      name: studentName,
      answers,
      timestamp: Date.now(),
      violations: finalViolations   // use captured value
    }
  ];

  setResults(newResults);
  localStorage.setItem("results", JSON.stringify(newResults));

  localStorage.setItem("quizTaken", "true");

  setViolations(0);  // reset AFTER storing correct value
};


  // Release scores and persist
  const releaseScores = () => {
    setReleased(true);
    localStorage.setItem("released", "true");
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
