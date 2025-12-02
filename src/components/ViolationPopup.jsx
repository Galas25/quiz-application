export default function ViolationPopup({ visible, onClose, count }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
    <p className="text-lg font-medium text-gray-800">
      You switched tabs! Violations: {count}
    </p>
    <button
      className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      onClick={onClose}
    >
      Close
    </button>
  </div>
</div>
  );
}
