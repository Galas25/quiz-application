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
    <div className="flex items-center justify-center min-h-screen w-full px-4 bg-gray-100">
  <div className="text-center w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
    <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to the Quiz App</h1>
    <button
      className="px-6 py-3 text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 transition w-full"
      onClick={startQuiz}
    >
      Start Quiz
    </button>
  </div>
</div>
  );
}
