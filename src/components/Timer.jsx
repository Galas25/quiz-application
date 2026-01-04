import { useState, useEffect } from "react";

export default function Timer({ duration, onExpire }) {
  const [time, setTime] = useState(duration);

  // Decrement the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger onExpire when time reaches 0
  useEffect(() => {
    if (time <= 0) {
      onExpire();
      setTime(0);
    }
  }, [time, onExpire]);

  const formatTime = sec => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  // Compute progress bar width
  const progress = (time / duration) * 100;

  return (
   <div className="w-full mb-2">
     <div className="flex justify-between items-center mb-1">
       <span className="text-sm font-medium text-gray-800">Time Remaining</span>
       <span className="text-sm font-bold text-gray-800">{formatTime(time)}</span>
     </div>
     <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden shadow-inner">
       <div
         className="h-full bg-red-500 transition-all duration-500"
         style={{ width: `${progress}%` }}
       ></div>
     </div>
   </div>

  );
}
