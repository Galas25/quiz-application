import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import StudentHome from "./pages/studentDashboard"; // This is your Dashboard
import QuizPage from "./pages/QuizPage";
import Result from "./components/Result";
import ResultPending from "./pages/ResultPending";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          {/* Default Landing */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* New Dashboard Route */}
          <Route path="/studenthome" element={<StudentHome />} />

          {/* Other Routes */}
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/pending" element={<ResultPending />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;