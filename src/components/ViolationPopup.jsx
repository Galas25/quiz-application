import { AlertTriangle, XCircle } from "lucide-react";

export default function ViolationPopup({ visible, onClose, count }) {
  if (!visible) return null;

  const isLastWarning = count === 2;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`p-1 ${isLastWarning ? 'bg-red-500' : 'bg-orange-500'}`} />
        
        <div className="p-8 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isLastWarning ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
            {isLastWarning ? <XCircle size={32} /> : <AlertTriangle size={32} />}
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Security Violation Detected
          </h2>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Our system detected a window focus change. Your progress is being monitored by the faculty portal.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <span className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Current Status</span>
            <span className={`text-2xl font-black ${isLastWarning ? 'text-red-600' : 'text-orange-600'}`}>
              {count} / 3 Violations
            </span>
          </div>

          <button
            className={`w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${
              isLastWarning ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-200'
            }`}
            onClick={onClose}
          >
            {isLastWarning ? "Final Warning: Acknowledge" : "I Understand"}
          </button>
        </div>
      </div>
    </div>
  );
}