import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import ProtectedRoute from "./components/ProtectedRoute";
// Layout
import DashboardLayout from "./pages/DashboardLayout";
// Pages
import StudentHome from "./pages/studentDashboard";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login";
import StorageDebug from "./pages/StorageDebug";

function App() {
  return (
      <QuizProvider>
        <Router>
          <Routes>
            {/* ===== Public Routes ===== */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* ===== Student Dashboard (Shared Layout) ===== */}
            <Route
              element={
                <ProtectedRoute roleRequired="student">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/studenthome" element={<StudentHome />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/result" element={<ResultPage />} />
            </Route>

            {/* ===== Instructor Dashboard ===== */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute roleRequired="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />

            {/* ===== Debug ===== */}
            <Route path="/debug" element={<StorageDebug />} />
          </Routes>
        </Router>
      </QuizProvider>
  );
}

export default App;
