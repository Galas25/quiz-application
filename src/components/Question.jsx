export default function Question({ question, onAnswer, selected }) {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
  <Timer duration={300} onExpire={handleSubmit} />
  {quizData.map(q => (
    <div key={q.id} className="bg-white p-6 rounded-xl shadow mb-6">
      <p className="font-semibold text-lg mb-4 text-gray-800">{q.question}</p>
      <div className="flex flex-col gap-3">
        {q.options.map(opt => (
          <button
            key={opt}
            className={`p-3 border rounded-lg transition text-gray-800 hover:bg-gray-50 ${
              answers[q.id] === opt ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
            onClick={() => handleAnswer(q.id, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  ))}
  <button
    className="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
    onClick={handleSubmit}
  >
    Submit
  </button>
  <ViolationPopup visible={showPopup} count={violations} onClose={() => setShowPopup(false)} />
</div>
  );
}
