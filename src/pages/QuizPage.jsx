import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QuizContext } from "../context/QuizContext";
import { Clock, ChevronLeft } from "lucide-react";
import Timer from "../components/Timer";
import Question from "../components/Question";
import ViolationPopup from "../components/ViolationPopup";

export default function QuizPage() {
  const { quizData, submitQuiz, logViolation, currentUser, results } =
    useContext(QuizContext);

  const [answers, setAnswers] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [violationCount, setViolationCount] = useState(0);
  const [popupCount, setPopupCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const hasSubmittedRef = useRef(false);

  // Expecting subjectKey and subjectName from navigation
  const subjectKey = location.state?.subjectKey;
  const subjectName = location.state?.subjectName;

  // Grab questions for this subject
  const subjectQuestions = quizData[subjectKey] || [];

  // Loading state
  useEffect(() => {
    if (quizData && Object.keys(quizData).length > 0) setLoading(false);
  }, [quizData]);

  // Redirect if invalid subject
  useEffect(() => {
    if (!subjectKey || !subjectQuestions.length) {
      navigate("/studenthome");
    }
  }, [subjectKey, subjectQuestions, navigate]);

  // Prevent re-taking this subject
  useEffect(() => {
    const subjectResults = results[subjectKey] || [];
    if (subjectResults.length) {
      navigate("/result", { state: { subjectKey, subjectName } });
    }
  }, [results, subjectKey, subjectName, navigate]);

  const handleSubmit = useCallback((force = false) => {
    if (hasSubmittedRef.current) return;

    if (
      !force &&
      subjectQuestions.length &&
      Object.keys(answers).length < subjectQuestions.length
    ) {
      alert("Please answer all questions before submitting.");
      return;
    }

    hasSubmittedRef.current = true;
    submitQuiz(subjectKey, answers);
    navigate("/result", { state: { subjectKey, subjectName } });
  }, [answers, subjectQuestions, submitQuiz, subjectKey, subjectName, navigate]);

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // Auto-submit on 3 violations
  useEffect(() => {
    if (violationCount >= 3 && !hasSubmittedRef.current) {
      handleSubmit(true);
    }
  }, [violationCount, handleSubmit]);

  // Tab violation logic
  useEffect(() => {
    const handleTabChange = () => {
      if (!document.hidden || hasSubmittedRef.current) return;

      const newCount = logViolation(subjectKey);
      setViolationCount(newCount);
      setPopupCount(newCount);
      setShowPopup(true);
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () =>
      document.removeEventListener("visibilitychange", handleTabChange);
  }, [logViolation, subjectKey]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="mb-4 text-gray-600">No active session found.</p>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-bold hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading assessment questions...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/studenthome")}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{subjectName} Quiz</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              Academic Integrity Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full border border-orange-200 font-bold">
            <Clock size={18} />
            <Timer duration={30} onExpire={() => handleSubmit(true)} />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-700">{currentUser}</span>
            <span className="text-[10px] text-red-500 font-black">
              VIOLATIONS: {violationCount}/3
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 space-y-6">
        {subjectQuestions.map((q, index) => (
          <div
            key={q.id || index}
            className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
          >
            <Question
              question={q}
              selected={answers[q.id]}
              onAnswer={val => handleAnswer(q.id, val)}
            />
          </div>
        ))}

        <div className="pt-8 pb-20">
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg"
          >
            Submit My Quiz
          </button>
        </div>
      </main>

      {/* Violation Popup */}
      <ViolationPopup
        visible={showPopup}
        count={popupCount}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
}
