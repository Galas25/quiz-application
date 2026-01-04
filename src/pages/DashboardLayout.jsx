import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { Home, BarChart2, LogOut, Menu, X, UserCircle } from "lucide-react";

export default function DashboardLayout() {
  const { currentUser, setCurrentUser } = useContext(QuizContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!currentUser && !savedUser) {
      navigate("/login");
    } else if (!currentUser && savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(typeof user === "string" ? user : user.name);
    }
  }, [currentUser, navigate, setCurrentUser]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-200 z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between">
          <h2 className="text-xl font-bold text-indigo-400 italic">
            Quiz Portal
          </h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              navigate("/studenthome");
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-4 px-4 py-3 bg-gray-800 rounded-lg"
          >
            <Home size={20} /> Home
          </button>

          <button
            onClick={() => {
              navigate("/result");
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg"
          >
            <BarChart2 size={20} /> My Grades
          </button>

          <div className="border-t border-gray-800 my-4 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-700 rounded-lg"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* HEADER */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
            <Menu size={22} />
          </button>

          <h1 className="text-xl text-gray-700">Quiz Portal</h1>
        </div>

        <div className="flex items-center gap-3 bg-blue-100 border border-blue-300 px-3 py-1">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-800">
              {currentUser}
            </span>
            <span className="text-xs text-blue-600">Student</span>
          </div>
          <UserCircle size={36} />
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
        &copy; 2025 Quiz Application. All rights reserved.
      </footer>
    </div>
  );
}
