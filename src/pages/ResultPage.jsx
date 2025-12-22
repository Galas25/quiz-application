import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { ChevronLeft, ClipboardList, Calendar, AlertCircle } from "lucide-react";

export default function ResultsPage() {
  const { results, currentUser } = useContext(QuizContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the subject name passed from the Folder button
  const subjectFilter = location.state?.subjectName;

  // Filter results for this specific student and this specific subject
  // Note: For your project, if you haven't added 'subject' to your submitQuiz logic yet, 
  // it will just show all of the current student's results.
  const filteredResults = results.filter(r => r.name === currentUser);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button 
          onClick={() => navigate("/studentdashboard")} 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {subjectFilter ? `${subjectFilter} History` : "My Quiz History"}
        </h1>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Assessment</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date Submitted</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Violations</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Status</th>
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
                          <div>
                            <p className="font-semibold text-gray-800">Module 1 Quiz</p>
                            <p className="text-xs text-gray-500">{subjectFilter || "General Science"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(result.timestamp).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.violations > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          <AlertCircle size={12} /> {result.violations}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-md border border-orange-100">
                          Pending Review
                        </span>
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
                You haven't submitted any quizzes for {subjectFilter || "this subject"} yet.
              </p>
              <button 
                onClick={() => navigate("/studentdashboard")}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
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