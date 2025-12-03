import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import Timer from "../components/Timer";
import Question from "../components/Question";
import ViolationPopup from "../components/ViolationPopup";

export default function QuizPage() {
  const { quizData, submitQuiz, violations, logViolation, currentUser } = useContext(QuizContext);
  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const quizTaken = localStorage.getItem("quizTaken");
    if (quizTaken === "true") {
      alert("You have already taken this quiz. Please wait for the instructor to release your score.");
      navigate("/result");
    }
  }, [navigate]);

  const handleSubmit = useCallback(() => {
    if (!currentUser) return alert("No user found. Please go back and enter your name.");
    submitQuiz(answers, currentUser);
    navigate("/result");
  }, [answers, currentUser, submitQuiz, navigate]);

  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        const updated = logViolation();
        setShowPopup(true);

        const count = typeof updated === "number" ? updated : violations + 1;
        if (count >= 3) {
          handleSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () => document.removeEventListener("visibilitychange", handleTabChange);
  }, [logViolation, violations, handleSubmit]);

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-lg text-gray-800">
        No student detected. Please go back to the home page and enter your name.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <Timer duration={30} onExpire={handleSubmit} />

      {quizData.map(q => (
        <Question
          key={q.id}
          question={q}
          selected={answers[q.id]}
          onAnswer={(val) => handleAnswer(q.id, val)}
        />
      ))}

      <button
        className="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <ViolationPopup visible={showPopup} count={violations} onClose={() => setShowPopup(false)} />
    </div>
  );
}
