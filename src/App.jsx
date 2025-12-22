import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import StudentHome from "./pages/studentDashboard";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the wrapper

function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Student Flow */}
          <Route path="/studenthome" element={
            <ProtectedRoute roleRequired="student">
              <StudentHome />
            </ProtectedRoute>
          } />

          <Route path="/quiz" element={
            <ProtectedRoute roleRequired="student">
              <QuizPage />
            </ProtectedRoute>
          } />

          <Route path="/result" element={
            <ProtectedRoute roleRequired="student">
              <ResultPage />
            </ProtectedRoute>
          } />

          {/* Protected Instructor Flow */}
          <Route path="/instructor" element={
            <ProtectedRoute roleRequired="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;