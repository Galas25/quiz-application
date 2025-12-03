import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";

export default function InstructorDashboard() {
  const { results, releaseScores, released } = useContext(QuizContext);

  const [questions, setQuestions] = useState([]);

  // Load questions
  useEffect(() => {
    fetch("/questions.json")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const calculateScore = (answers) => {
    if (!questions || questions.length === 0) return 0;
    return Object.entries(answers).reduce((acc, [id, ans]) => {
      const q = questions.find(q => String(q.id) === String(id));
      return acc + (q && q.answer === ans ? 1 : 0);
    }, 0);
  };

  // Release scores and persist in localStorage
  const handleReleaseScores = () => {
    releaseScores();
    localStorage.setItem("released", "true");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Instructor Dashboard</h1>

      <button
        className="px-5 py-3 bg-blue-500 text-white rounded-lg mb-6 hover:bg-blue-600 transition"
        onClick={handleReleaseScores}
        disabled={released}
      >
        {released ? "Results Released" : "Release Results"}
      </button>

      {results.length === 0 ? (
        <p className="text-gray-700">No submissions yet.</p>
      ) : (
        <table className="w-full border-collapse text-left bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Violations</th>
              <th className="p-3">Score</th>
              <th className="p-3">Submitted At</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.violations}</td>
                <td className="p-3">
                  {released && questions.length > 0 ? calculateScore(r.answers) : "Pending"}
                </td>
                <td className="p-3">{new Date(r.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
