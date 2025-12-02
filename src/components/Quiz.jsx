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
    return (
      <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
          <p className="text-lg text-gray-800">
            You have already taken this quiz. Please wait for the instructor to release your score.
          </p>
        </div>
      </div>
    );
  }

  const handleAnswer = (id, value) => setAnswers({ ...answers, [id]: value });
  const handleSubmit = () => submitQuiz(answers);

  return (
    <div className="flex justify-center p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-2xl">
        {/* Timer */}
        <Timer duration={300} onExpire={handleSubmit} />

        {/* Questions */}
        <div className="mt-6 space-y-6">
          {quizData.map(q => (
            <Question
              key={q.id}
              question={q}
              onAnswer={(val) => handleAnswer(q.id, val)}
              selected={answers[q.id]}
            />
          ))}
        </div>

        {/* Submit button */}
        <div className="mt-6 text-center">
          <button
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Violation popup */}
        <ViolationPopup
          visible={showPopup}
          count={violations}
          onClose={() => setShowPopup(false)}
        />
      </div>
    </div>
  );
}
