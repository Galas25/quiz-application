import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

export default function Result() {
  const { results, released, quizData } = useContext(QuizContext);

  if (!released || results.length === 0) {
    return (
      <div className="p-6 text-center text-lg">
        Your answers have been submitted. Please wait for the instructor to release the results.
      </div>
    );
  }

  const studentResult = results[results.length - 1];

  // Build correctAnswers dynamically from quizData
  const correctAnswers = {};
  quizData.forEach(q => {
    correctAnswers[q.id] = q.answer;
  });

  const score = Object.entries(studentResult.answers).reduce((acc, [id, ans]) => {
    return acc + (correctAnswers[id] === ans ? 1 : 0);
  }, 0);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Your Score</h2>
      <p className="text-lg">
        Score: {score}/{Object.keys(studentResult.answers).length}
      </p>
      <p>Violations: {studentResult.violations}</p>
      <p>Submitted At: {new Date(studentResult.timestamp).toLocaleString()}</p>
    </div>
  );
}
