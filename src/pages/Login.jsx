import { useContext, useState, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { setCurrentUser } = useContext(QuizContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const MOCK_USERS = [
    { email: "student@test.com", password: "123", name: "Alex" },
    { email: "guest@test.com", password: "password", name: "Guest User" }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");

    // Logic: If user is logged in, always go to Dashboard first
    // They can decide to go to Results or Quiz from there
    if (savedUser) {
      navigate("/studenthome");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setCurrentUser(user.name);
      localStorage.setItem("currentUser", JSON.stringify(user));

      navigate("/studenthome");
    } else {
      alert("Invalid email or password.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 bg-gray-100">
      <div className="text-center w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Please enter your details to sign in</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full font-semibold"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline">Sign up</span>
        </div>
      </div>
    </div>
  );
}