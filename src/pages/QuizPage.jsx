import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { Clock, Send, ChevronLeft } from "lucide-react";
import Timer from "../components/Timer";
import Question from "../components/Question";
import ViolationPopup from "../components/ViolationPopup";

export default function QuizPage() {
  const { quizData, submitQuiz, logViolation, currentUser, violations } = useContext(QuizContext);
  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // 1. Prevent re-taking the quiz
  useEffect(() => {
    const quizTaken = localStorage.getItem("quizTaken");
    if (quizTaken === "true") {
      navigate("/result");
    }
  }, [navigate]);

  // 2. Wrap submit in useCallback
  const handleSubmit = useCallback(() => {
    submitQuiz(answers, currentUser);
    navigate("/result");
  }, [answers, currentUser, submitQuiz, navigate]);

  // 3. Tab Tracking Logic
  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        logViolation();
        setShowPopup(true);
      }
    };
    document.addEventListener("visibilitychange", handleTabChange);
    return () => document.removeEventListener("visibilitychange", handleTabChange);
  }, [logViolation]);

  // 4. Auto-submit on 3rd violation
  useEffect(() => {
    if (violations >= 3) {
      handleSubmit();
    }
  }, [violations, handleSubmit]);

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // 5. SAFETY CHECK: If no user, show login prompt
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="mb-4 text-gray-600">No active session found.</p>
          <button onClick={() => navigate("/")} className="text-blue-600 font-bold hover:underline">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/studenthome")} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Final Assessment</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Academic Integrity Enabled</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full border border-orange-200 font-bold">
            <Clock size={18} />
            <Timer duration={30} onExpire={handleSubmit} />
          </div>
          <div className="flex flex-col items-end">
             <span className="text-xs font-bold text-gray-700">{currentUser}</span>
             <span className="text-[10px] text-red-500 font-black">VIOLATIONS: {violations}/3</span>
          </div>
        </div>
      </header>

      {/* --- MAIN QUIZ CONTENT --- */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-blue-800 text-sm italic font-medium">
              Note: Do not switch tabs or minimize this window.
            </p>
          </div>

          {/* QUESTIONS LIST - This is the part that might have been missing */}
          <div className="space-y-4">
            {quizData && quizData.length > 0 ? (
              quizData.map((q, index) => (
                <div key={q.id || index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all hover:border-blue-200">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-grow">
                      <Question
                        question={q}
                        selected={answers[q.id]}
                        onAnswer={(val) => handleAnswer(q.id, val)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-400">
                Loading assessment questions...
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-8 pb-20">
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg"
            >
              <Send size={20} />
              Submit My Quiz
            </button>
          </div>
        </div>
      </main>

      {/* Violation Popup */}
      <ViolationPopup
        visible={showPopup}
        count={violations}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}