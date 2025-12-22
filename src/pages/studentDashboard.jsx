import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Folder,
  UserCircle,
  LogOut,
  Menu,
  BookOpen,
  BarChart2,
  X,
  Home,
  Settings
} from "lucide-react";

export default function StudentHome() {
  const { currentUser, setCurrentUser } = useContext(QuizContext);
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls Hamburger Menu

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!currentUser && !savedUser) {
      navigate("/login");
    } else if (!currentUser && savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user.name);
    }
  }, [currentUser, navigate, setCurrentUser]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const [subjects, setSubjects] = useState([
    { id: 1, title: "Astronomy", section: "Block 1", color: "bg-purple-700" },
    { id: 2, title: "Earth Science", section: "Block 2", color: "bg-pink-600" },
    { id: 3, title: "Honors Earth Science", section: "Block 3", color: "bg-teal-600" },
  ]);

  const handleUnenroll = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* --- SIDEBAR DRAWER (The Hamburger Content) --- */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600 italic">Quiz Portal</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button onClick={() => {navigate("/studentdashboard"); setIsSidebarOpen(false)}} className="w-full flex items-center gap-4 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium">
            <Home size={20} /> Home
          </button>
          <button onClick={() => {navigate("/result"); setIsSidebarOpen(false)}} className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <BarChart2 size={20} /> My Grades
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium">
            <Settings size={20} /> Settings
          </button>
          <div className="border-t border-gray-100 my-4 pt-4">
             <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-medium">
                <LogOut size={20} /> Logout
             </button>
          </div>
        </nav>
      </div>

      {/* Background Overlay when Sidebar is open */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)} // Toggle Sidebar
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-normal text-gray-700">Quiz Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm text-gray-600">Hi, {currentUser}</span>
          <UserCircle size={36} className="text-gray-400 border rounded-full" />
        </div>
      </header>

      {/* --- MAIN CONTENT (Grid) --- */}
      <main className="flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-visible">

              {/* Card Header */}
              <div className={`${subject.color} p-4 text-white h-24 rounded-t-lg relative`}>
                <div className="flex justify-between items-start">
                  <div onClick={() => navigate("/quiz", { state: { subjectName: subject.title } })} className="cursor-pointer group">
                    <h2 className="text-xl font-semibold leading-tight group-hover:underline">{subject.title}</h2>
                    <p className="text-sm opacity-90">{subject.section}</p>
                  </div>
                  <div className="relative">
                    <button onClick={() => setOpenMenuId(openMenuId === subject.id ? null : subject.id)} className="p-1 hover:bg-white/20 rounded-full">
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === subject.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-100 z-30 py-1">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <BarChart2 size={16} /> View Grades
                        </button>
                        <button onClick={() => handleUnenroll(subject.id)} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <LogOut size={16} /> Unenroll
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex-1 p-4 min-h-[120px]">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 font-sans">Upcoming</h3>
                <div onClick={() => navigate("/quiz")} className="flex items-center gap-3 text-sm text-blue-600 cursor-pointer hover:underline">
                  <BookOpen size={16} />
                  <span>Module 1 Quiz</span>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-3 flex justify-end">
                <button title="View History" onClick={() => navigate("/result")} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition">
                  <Folder size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
        <p>&copy; 2024 QuizPortal. All rights reserved.</p>
      </footer>

      {/* Outside click handler for card dropdowns */}
      {openMenuId && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenMenuId(null)}></div>
      )}
    </div>
  );
}