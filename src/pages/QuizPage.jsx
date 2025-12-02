import { useState, useEffect, useContext } from "react";
import { QuizContext } from "../context/QuizContext";
import Timer from "../components/Timer";
import Question from "../components/Question";
import ViolationPopup from "../components/ViolationPopup";

export default function QuizPage() {
  const { quizData, submitQuiz, violations, logViolation } = useContext(QuizContext);
  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // Handle tab changes and violations
  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        logViolation(prev => {
          const newCount = prev + 1;
          setShowPopup(true);

          if (newCount >= 3) {
            submitQuiz(answers);
          }

          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () => document.removeEventListener("visibilitychange", handleTabChange);
  }, [answers, logViolation, submitQuiz]);

  // Prevent quiz retake
  if (localStorage.getItem("quizTaken")) {
    return (
      <div className="p-6 text-center text-lg">
        You have already taken this quiz. Please wait for the instructor to release your score.
      </div>
    );
  }

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => submitQuiz(answers);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Timer duration={300} onExpire={handleSubmit} />
      {quizData.map((q) => (
        <Question
          key={q.id}
          question={q}
          onAnswer={handleAnswer}
          selected={answers[q.id]}
        />
      ))}
      <button
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={handleSubmit}
        type="button"
      >
        Submit
      </button>
      <ViolationPopup
        visible={showPopup}
        count={violations}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
