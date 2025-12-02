import { createContext, useState, useEffect } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [results, setResults] = useState([]);
  const [violations, setViolations] = useState(0);
  const [released, setReleased] = useState(false);

  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuizData(data));
  }, []);

  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  const logViolation = () => setViolations(v => v + 1);

  const submitQuiz = (answers, name = "Student") => {
    setResults(prev => [
      ...prev,
      { name, answers, timestamp: new Date(), violations }
    ]);
    localStorage.setItem("quizTaken", "true");
  };

  const releaseScores = () => setReleased(true);

  return (
    <QuizContext.Provider value={{
      quizData,
      currentUser,
      setCurrentUser,
      results,
      setResults,
      violations,
      logViolation,
      submitQuiz,
      released,
      releaseScores
    }}>
      {children}
    </QuizContext.Provider>
  );
};
