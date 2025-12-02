import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";

export default function StudentHome() {
  const { setCurrentUser } = useContext(QuizContext);
  const navigate = useNavigate();

  const startQuiz = () => {
    setCurrentUser("student");
    navigate("/quiz");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Quiz App</h1>
      <button
        type="button"
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={startQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
}
