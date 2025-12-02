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
<div className="flex items-center justify-center min-h-screen w-full px-4">
  <div className="text-center w-full max-w-md">
    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Welcome to the Quiz App</h1>
    <button
      type="button"
      className="px-6 py-3 text-lg sm:text-xl bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
      onClick={startQuiz}
    >
      Start Quiz
    </button>
  </div>
</div>





  );
}
