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
      return acc + (q && q.answer === ans ? 1 : 0);
    }, 0);
  };

  const handleReleaseScores = () => {
    releaseScores();
    localStorage.setItem("released", "true");
  };

  // Flatten all results
  const allSubmissions = Object.values(results || {}).flat();
  const totalSubmissions = allSubmissions.length;
  const flaggedCount = allSubmissions.filter(r => r?.violations > 0).length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3 text-blue-600">
          <GraduationCap size={32} />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Faculty Portal</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold">
            <LayoutDashboard size={18} /> Overview
          </button>
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Tools</p>
          </div>
          <button
            onClick={clearAllData}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition"
          >
            <XCircle size={18} /> Reset Database
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="mb-4 px-4">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Instructor</p>
            <p className="text-sm font-bold text-slate-700 truncate">{currentUser || "Faculty"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-semibold transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by student name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleReleaseScores}
            disabled={released}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition ${
              released
                ? "bg-slate-100 text-slate-400"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
            }`}
          >
            {released ? <CheckCircle size={18} /> : <Clock size={18} />}
            {released ? "Grades Finalized" : "Finalize & Release"}
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{totalSubmissions}</h3>
              <p className="text-slate-500 text-sm font-medium">Submissions Received</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{flaggedCount}</h3>
              <p className="text-slate-500 text-sm font-medium">Integrity Reviews Needed</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Filter size={20} />
              </div>
              <h3 className={`text-3xl font-bold ${released ? 'text-green-600' : 'text-slate-800'}`}>
                {released ? "Finalized" : "Drafting"}
              </h3>
              <p className="text-slate-500 text-sm font-medium">Grading Status</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg">Student Submissions</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">Live Updates</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Module</th>
                    <th className="px-6 py-4">Quiz</th>
                    <th className="px-6 py-4">Security Flags</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allSubmissions.length > 0 ? (
                    allSubmissions
                      .filter(r => (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((r, i) => {
                        const score = calculateScore(r.subject, r.answers);
                        return (
                          <tr key={i} className="hover:bg-slate-50 transition group">
                            <td className="px-6 py-4 font-bold text-slate-700">{r.name || "Anonymous"}</td>
                            <td className="px-6 py-4">{r.subject || "N/A"}</td>
                            <td className="px-6 py-4">{r.module || "N/A"}</td>
                            <td className="px-6 py-4">{r.quizName || "N/A"}</td>
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
                                  <span className="font-bold text-slate-800 text-sm">{score} / {quizData[r.subject]?.length || 0}</span>
                                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500"
                                      style={{ width: `${quizData[r.subject]?.length ? (score/quizData[r.subject].length)*100 : 0}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[11px] font-bold text-slate-400 italic">Reviewing...</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium">
                              {r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                            </td>
                          </tr>
                        )
                      })
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-20 text-center text-slate-400">
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
