import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { ChevronLeft, ClipboardList, Calendar, AlertCircle, Folder } from "lucide-react";

export default function ResultsPage() {
  const { results, currentUser, released } = useContext(QuizContext);
  const location = useLocation();
  const navigate = useNavigate();

  const subjectFilter = location.state?.subjectName;

  // Logic for robust comparison
  const filteredResults = results.filter(r => {
    const currentName = typeof currentUser === 'object' ? currentUser?.name : currentUser;
    const resultName = typeof r.name === 'object' ? r.name?.name : r.name;
    return resultName === currentName;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => navigate("/studenthome")}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {subjectFilter ? `${subjectFilter} History` : "My Quiz History"}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Viewing results for {typeof currentUser === 'object' ? currentUser.name : currentUser}
          </p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* --- SUMMARY STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Overall Grade</p>
            <h3 className="text-3xl font-bold text-blue-600">{released ? "88%" : "Pending"}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Quizzes Completed</p>
            <h3 className="text-3xl font-bold text-gray-800">{filteredResults.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Academic Integrity</p>
            <h3 className={`text-3xl font-bold ${filteredResults.some(r => r.violations > 0) ? 'text-orange-500' : 'text-green-500'}`}>
              {filteredResults.some(r => r.violations > 0) ? "Warning" : "Clear"}
            </h3>
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assessment</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Violations</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Grade Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResults.map((result, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <ClipboardList size={20} />
                          </div>
                          <p className="font-semibold text-gray-800">Module 1 Quiz</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(result.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          result.violations > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}>
                          <AlertCircle size={12} /> {result.violations}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {released ? (
                          <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200">
                            Scored: 85%
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* --- EMPTY STATE --- */
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No records found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2">
                Once you finish a quiz, your submission data will appear here.
              </p>
              <button
                onClick={() => navigate("/studenthome")}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}