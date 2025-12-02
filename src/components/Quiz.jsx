import { useState, useEffect, useContext } from "react";
import { QuizContext } from "../context/QuizContext";
import Timer from "./Timer";
import Question from "./Question";
import ViolationPopup from "./ViolationPopup";


export default function QuizPage() {
  const { quizData, submitQuiz, violations, logViolation } = useContext(QuizContext);
  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        logViolation();
        setShowPopup(true);
        if (violations + 1 >= 3) submitQuiz(answers);
      }
    };
    document.addEventListener("visibilitychange", handleTabChange);
    return () => document.removeEventListener("visibilitychange", handleTabChange);
  }, [violations, answers, logViolation, submitQuiz]);

  if (localStorage.getItem("quizTaken")) {
    return <div className="p-6 text-center text-lg">You have already taken this quiz. Please wait for the instructor to release your score.</div>;
  }

  const handleAnswer = (id, value) => setAnswers({ ...answers, [id]: value });
  const handleSubmit = () => submitQuiz(answers);

  return (
    <div className="p-6">
      <Timer duration={300} onExpire={handleSubmit} />
      {quizData.map(q => (
        <Question
          key={q.id}
          question={q}
          onAnswer={(val) => handleAnswer(q.id, val)}
          selected={answers[q.id]}
        />
      ))}
      <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded" onClick={handleSubmit}>Submit</button>
      <ViolationPopup visible={showPopup} count={violations} onClose={() => setShowPopup(false)} />
    </div>
  );
}
