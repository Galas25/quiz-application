export default function Question({ question, onAnswer, selected }) {
  return (
    <div className="mb-4 p-4 border rounded shadow bg-white">
      <p className="font-semibold mb-2">{question.question}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`p-2 border rounded hover:bg-gray-200 transition ${
              selected === opt ? "bg-blue-200 border-blue-400" : "bg-white"
            }`}
            onClick={() => onAnswer(question.id, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
