import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext";
import StudentHome from "./pages/StudentHome";
import QuizPage from "./pages/QuizPage";
import ResultPending from "./pages/ResultPending";
import InstructorDashboard from "./components/InstructorDashboard";


function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/pending" element={<ResultPending />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
          {/* Optional catch-all route */}
          {/* <Route path="*" element={<StudentHome />} /> */}
        </Routes>
      </Router>
    </QuizProvider>
  );
}

export default App;
