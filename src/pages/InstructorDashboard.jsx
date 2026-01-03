import { useContext, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  Clock,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  GraduationCap,
  Search,
  BookOpen,
  Filter,
  XCircle
} from "lucide-react";

export default function InstructorDashboard() {
  const { results, setResults, releaseScores, released, setCurrentUser, currentUser, quizData } = useContext(QuizContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure? This will delete all student submissions for the demo.")) {
      setResults({});
      localStorage.removeItem("results");
      localStorage.removeItem("released");
      window.location.reload();
    }
  };

  const calculateScore = (subjectKey, answers) => {
    const subjectQuestions = quizData[subjectKey] || [];
    if (!subjectQuestions.length || !answers) return 0;
    return Object.entries(answers).reduce((acc, [id, ans]) => {
      const q = subjectQuestions.find(q => String(q.id) === String(id));
      if (!q) return acc;
      let selectedIndex = typeof ans === 'number' ? Number(ans) : q.options.indexOf(ans);
      return acc + (selectedIndex === Number(q.answer) ? 1 : 0);
    }, 0);
  };

  const handleReleaseScores = () => {
    releaseScores();
    localStorage.setItem("released", "true");
  };

  const allSubmissions = Object.values(results || {}).flat();
  const totalSubmissions = allSubmissions.length;
  const flaggedCount = allSubmissions.filter(r => r?.violations > 0).length;
  const avgIntegrity = allSubmissions.length > 0
    ? allSubmissions.reduce((sum, r) => sum + (100 - (r.violations / 3 * 100)), 0) / allSubmissions.length
    : 100;
  const uniqueStudents = new Set(allSubmissions.map(r => r.name)).size;

  return (
    <div className="instructor-dashboard flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3 text-indigo-400">
          <GraduationCap size={32} />
          <h1 className="text-xl font-bold text-white tracking-tight">Faculty Portal</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-700 text-white rounded-xl text-sm font-semibold">
            <LayoutDashboard size={18} /> Overview
          </button>
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Database Tools</p>
          </div>
          <button
            onClick={clearAllData}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition"
          >
            <XCircle size={18} /> Reset Database
          </button>
        </nav>

        <div className="p-6 border-t border-gray-700">
          <div className="mb-4 px-4">
            <p className="text-[10px] text-indigo-300 uppercase font-bold">Instructor</p>
            <p className="text-sm font-bold text-white truncate">{currentUser || "Faculty"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-indigo-300 hover:text-red-500 hover:bg-red-700 rounded-xl text-sm font-semibold transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-gray-900">
        <header className="h-20 bg-gray-800 border-b border-gray-700 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
            <input
              type="text"
              placeholder="Search by student name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-sm text-white placeholder-indigo-300 focus:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleReleaseScores}
            disabled={released}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition ${
              released
                ? "bg-gray-700 text-gray-400"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
            }`}
          >
            {released ? <CheckCircle size={18} /> : <Clock size={18} />}
            {released ? "Grades Finalized" : "Finalize & Release"}
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-3xl font-bold text-white">{totalSubmissions}</h3>
              <p className="text-indigo-300 text-sm font-medium">Quizzes Completed</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center mb-4">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-3xl font-bold text-white">{avgIntegrity.toFixed(0)}%</h3>
              <p className="text-indigo-300 text-sm font-medium">Academic Integrity</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-3xl font-bold text-white">{uniqueStudents}</h3>
              <p className="text-indigo-300 text-sm font-medium">Records Found</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4">
                <Filter size={20} />
              </div>
              <h3 className={`text-3xl font-bold ${released ? 'text-green-400' : 'text-white'}`}>
                {released ? "Finalized" : "Drafting"}
              </h3>
              <p className="text-indigo-300 text-sm font-medium">Grading Status</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-white text-lg">Student Submissions</h2>
              <span className="text-xs font-bold text-indigo-300 bg-gray-700 px-3 py-1 rounded-full uppercase tracking-tighter">Live Updates</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800/50">
                  <tr className="text-indigo-300 text-[11px] font-bold uppercase tracking-widest border-b border-gray-700">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Quiz</th>
                    <th className="px-6 py-4">Security Flags</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {allSubmissions.length > 0 ? (
                    allSubmissions
                      .filter(r => (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((r, i) => {
                        const score = calculateScore(r.subject, r.answers);
                        return (
                          <tr key={i} className="hover:bg-gray-700 transition group">
                            <td className="px-6 py-4 font-bold text-white">{r.name || "Anonymous"}</td>
                            <td className="px-6 py-4 text-indigo-200">{r.subject || "N/A"}</td>
                            <td className="px-6 py-4 text-indigo-200">{r.module || "N/A"}</td>
                            <td className="px-6 py-4 text-indigo-200">{r.quizName || "N/A"}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                                r.violations > 0 ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-green-50 text-green-600 border border-green-100"
                              }`}>
                                {r.violations > 0 ? <ShieldAlert size={12} /> : <CheckCircle size={12} />}
                                {r.violations === 0 ? "No Issues" : `${r.violations} Incident(s)`}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {released ? (
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-sm">{score} / {quizData[r.subject]?.length || 0}</span>
                                  <div className="w-24 h-1.5 bg-indigo-700/30 rounded-full mt-1 overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-600"
                                      style={{ width: `${quizData[r.subject]?.length ? (score/quizData[r.subject].length)*100 : 0}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[11px] font-bold text-indigo-300 italic">Reviewing...</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-indigo-300 font-medium">
                              {r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                            </td>
                          </tr>
                        )
                      })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-20 text-center text-indigo-300">
                        <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No submissions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
