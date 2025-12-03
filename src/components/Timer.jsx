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
    }
  }, [time, onExpire]);

  const formatTime = sec => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  return (
    <div className="inline-block bg-white px-4 py-2 rounded-lg shadow text-gray-700 font-semibold mb-4">
      Time Left: {formatTime(time)}
    </div>
  );
}
