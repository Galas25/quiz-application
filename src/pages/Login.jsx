import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, User, ShieldCheck } from "lucide-react";
// ThemeContext removed to restore original styling

export default function Login() {
  const { setCurrentUser } = useContext(QuizContext);
  const [isAdminMode, setIsAdminMode] = useState(false); // Toggle state
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const MOCK_USERS = [
    { email: "student@test.com", password: "123", name: "Alex", role: "student" },
    { email: "instructor@test.com", password: "admin", name: "Professor Smith", role: "instructor" }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      navigate(user.role === "instructor" ? "/instructor" : "/studenthome");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email &&
             u.password === credentials.password &&
             u.role === (isAdminMode ? "instructor" : "student")
    );

    if (user) {
      setCurrentUser(user.name);
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(user.role === "instructor" ? "/instructor" : "/studenthome");
    } else {
      alert(`Invalid ${isAdminMode ? "Instructor" : "Student"} credentials.`);
    }
  };

  // no theme context in original version

  return (
    <div className={`flex items-center justify-center min-h-screen w-full px-4 transition-colors duration-500`}>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl relative overflow-hidden">

        {/* --- MODE INDICATOR STRIP --- */}
        <div className={`absolute top-0 left-0 w-full h-2 transition-colors ${isAdminMode ? "bg-indigo-600" : "bg-blue-600"}`} />

        <div className="text-center mt-4">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-transform duration-500 ${isAdminMode ? "bg-indigo-100 text-indigo-600 rotate-[360deg]" : "bg-blue-100 text-blue-600"}`}>
            {isAdminMode ? <ShieldCheck size={32} /> : <User size={32} />}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isAdminMode ? "Instructor Login" : "Student Login"}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {isAdminMode ? "Access faculty management tools" : "Enter your details to start learning"}
          </p>
        </div>

        {/* --- MODE SWITCHER (The "Switch Back" thing) --- */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => { setIsAdminMode(false); setCredentials({email:"", password:""}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${!isAdminMode ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <User size={16} /> Student
          </button>
          <button
            onClick={() => { setIsAdminMode(true); setCredentials({email:"", password:""}); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition ${isAdminMode ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <GraduationCap size={16} /> Instructor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder={isAdminMode ? "instructor@test.com" : "student@test.com"}
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${isAdminMode ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
          >
            Sign In as {isAdminMode ? "Faculty" : "Student"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 italic">
            {isAdminMode ? "Secured Faculty Entry Point" : "Standard Student Access"}
          </p>
        </div>
      </div>
    </div>
  );
}