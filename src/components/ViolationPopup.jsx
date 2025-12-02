export default function ViolationPopup({ visible, onClose, count }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="alert"
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <p className="text-lg font-medium">
          You switched tabs! Violations: {count}
        </p>
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
