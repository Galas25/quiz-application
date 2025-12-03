// Question.jsx
export default function Question({ question, selected, onAnswer }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-3xl mx-auto">
      <p className="font-semibold text-lg mb-4 text-gray-800">{question.question}</p>
      <div className="flex flex-col gap-3">
        {question.options.map(opt => (
          <button
            key={opt}
            className={`p-3 border rounded-lg transition text-gray-800 hover:bg-gray-50 ${
              selected === opt ? "bg-blue-100 border-blue-400" : "bg-white"
            }`}
            onClick={() => {
              console.log("Clicked option:", opt, "for question:", question.id);
              onAnswer(opt);
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
