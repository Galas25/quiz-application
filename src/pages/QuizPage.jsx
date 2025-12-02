import { useState, useEffect, useContext } from "react";
import { QuizContext } from "../context/QuizContext";
import Timer from "../components/Timer";
import Question from "../components/Question";
import ViolationPopup from "../components/ViolationPopup";

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
  }, [answers, violations, logViolation, submitQuiz]);
  if (localStorage.getItem("quizTaken")) {
    return (
      <div className="p-6 text-center text-lg text-gray-800">
        You have already taken this quiz. Please wait for the instructor to release your score.
      </div>
    );
  }
  const handleAnswer = (id, value) => setAnswers({ ...answers, [id]: value });
  const handleSubmit = () => submitQuiz(answers);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
  <Timer duration={30} onExpire={handleSubmit} />
  {quizData.map(q => (
    <div key={q.id} className="bg-white p-6 rounded-xl shadow mb-6">
      <p className="font-semibold text-lg mb-4 text-gray-800">{q.question}</p>
      <div className="flex flex-col gap-3">
        {q.options.map(opt => (
          <button
            key={opt}
            className={`p-3 border rounded-lg transition text-gray-800 hover:bg-gray-50 ${
              answers[q.id] === opt ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
            onClick={() => handleAnswer(q.id, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
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
