import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { Clock, AlertTriangle, Send, ChevronLeft } from "lucide-react"; // Added icons
import Timer from "../components/Timer";
import Question from "../components/Question";
import ViolationPopup from "../components/ViolationPopup";

export default function QuizPage() {
  const { quizData, submitQuiz, logViolation, currentUser } = useContext(QuizContext);

  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const quizTaken = localStorage.getItem("quizTaken");
    if (quizTaken === "true") {
      navigate("/result");
    }
  }, [navigate]);

  const handleSubmit = useCallback(() => {
    submitQuiz(answers, currentUser);
    navigate("/result");
  }, [answers, currentUser, submitQuiz, navigate]);

  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        const updatedCount = logViolation();
        setViolationCount(updatedCount);
        setShowPopup(true);

        if (updatedCount >= 3) {
          handleSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () => document.removeEventListener("visibilitychange", handleTabChange);
  }, [logViolation, handleSubmit]);

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
         <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <p className="text-lg text-gray-600 mb-4 font-medium">No student session detected.</p>
            <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold hover:underline">Return to Login</button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* --- QUIZ HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/studenthome")}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Final Assessment: General Science</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-tight">Required for all students</p>
          </div>
        </div>

        {/* Floating Timer in Header */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full border border-orange-200 font-bold">
            <Clock size={18} />
            <Timer duration={30} onExpire={handleSubmit} />
          </div>
          <div className="hidden md:flex flex-col items-end">
             <span className="text-sm font-bold text-gray-700">{currentUser}</span>
             <span className="text-[10px] text-red-500 uppercase tracking-widest">Violations: {violationCount}/3</span>
          </div>
        </div>
      </header>

      {/* --- QUIZ BODY --- */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Instructions Box */}
          <div className="bg-white border-l-4 border-blue-600 p-5 rounded-r-lg shadow-sm">
             <h2 className="text-blue-700 font-bold text-sm uppercase mb-1">Instructions</h2>
             <p className="text-gray-600 text-sm italic">
               Tab switching or window minimization will result in a violation. 3 violations will result in automatic submission.
             </p>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {quizData.map((q, index) => (
              <div key={q.id} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-blue-200">
                <div className="flex gap-4">
                   <span className="flex-shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                   </span>
                   <div className="flex-grow">
                      <Question
                        question={q}
                        selected={answers[q.id]}
                        onAnswer={val => handleAnswer(q.id, val)}
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action Area */}
          <div className="pt-8 pb-12">
            <button
              className="group w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
              onClick={handleSubmit}
            >
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Turn In Assignment
            </button>
            <p className="text-center text-gray-400 text-xs mt-4">
               Once submitted, you cannot change your answers.
            </p>
          </div>
        </div>
      </main>

      <ViolationPopup
        visible={showPopup}
        count={violationCount}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}