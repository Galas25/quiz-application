import { useContext } from "react";
import { QuizContext } from "../context/QuizContext";

// Define correct answers per question ID
const correctAnswers = {
  1: "4",
  2: "JavaScript",
  3: "React"
  // add more as needed
};

export default function InstructorDashboard() {
  const { results, releaseScores, released } = useContext(QuizContext);

  const calculateScore = (answers) => {
    return Object.entries(answers).reduce((acc, [id, ans]) => {
      return acc + (correctAnswers[id] === ans ? 1 : 0);
    }, 0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Instructor Dashboard</h1>
      <button
        type="button"
        className="px-4 py-2 bg-blue-500 text-white rounded mb-6 hover:bg-blue-600 transition"
        onClick={releaseScores}
        disabled={released}
      >
        {released ? "Results Released" : "Release Results"}
      </button>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Violations</th>
            <th className="p-2">Score</th>
            <th className="p-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.violations}</td>
              <td className="p-2">{released ? calculateScore(r.answers) : "Pending"}</td>
              <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
