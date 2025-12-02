import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

export default function Result() {
  const { results, released, quizData } = useContext(QuizContext);

  if (!released || results.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded shadow-md max-w-lg text-center">
          <p className="text-gray-800 text-lg">
            Your answers have been submitted. Please wait for the instructor to release the results.
          </p>
        </div>
      </div>
    );
  }

  const studentResult = results[results.length - 1];
  const correctAnswers = {};
  quizData.forEach(q => {
    correctAnswers[q.id] = q.answer;
  });

  const score = Object.entries(studentResult.answers).reduce((acc, [id, ans]) => {
    return acc + (correctAnswers[id] === ans ? 1 : 0);
  }, 0);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
  <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg text-center">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Score</h2>
    <p className="text-lg text-gray-700 mb-2">
      Score: {score}/{Object.keys(studentResult.answers).length}
    </p>
    <p className="text-gray-700 mb-2">Violations: {studentResult.violations}</p>
    <p className="text-gray-700">
      Submitted At: {new Date(studentResult.timestamp).toLocaleString()}
    </p>
  </div>
</div>
  );
}
