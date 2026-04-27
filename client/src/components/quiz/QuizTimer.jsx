import { Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const QuizTimer = ({ expiresAt, serverTime, onExpire }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const serverNow = serverTime ? new Date(serverTime).getTime() : Date.now();
    const clientNow = Date.now();
    const offset = serverNow - clientNow;

    const calculateRemaining = () => {
      const adjustedNow = Date.now() + offset;
      const endTime = new Date(expiresAt).getTime();
      const seconds = Math.max(0, Math.floor((endTime - adjustedNow) / 1000));

      setRemainingSeconds(seconds);

      if (seconds <= 0) {
        onExpire?.();
      }
    };

    calculateRemaining();

    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, serverTime, onExpire]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, [remainingSeconds]);

  const isDanger = remainingSeconds <= 60;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-black ${
        isDanger
          ? "bg-red-50 text-red-700"
          : "bg-slate-950 text-white"
      }`}
    >
      <Clock3 className="h-5 w-5" />
      <span>{formattedTime}</span>
    </div>
  );
};

export default QuizTimer;