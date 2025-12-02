import { createContext, useState, useEffect } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // "student" or "instructor"
  const [results, setResults] = useState([]);
  const [violations, setViolations] = useState(0);
  const [released, setReleased] = useState(false);

  // Load questions from public/questions.json
  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuizData(data));
  }, []);

  // Optional: Load persisted results from localStorage
  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  // Optional: Persist results on change
  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  // Increment tab violations
  const logViolation = () => setViolations(v => v + 1);

  // Submit quiz answers
  const submitQuiz = (answers, name = "Student") => {
    setResults(prev => [...prev, { name, answers, timestamp: new Date(), violations }]);
    localStorage.setItem("quizTaken", "true");
  };

  // Instructor releases scores
  const releaseScores = () => setReleased(true);

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
