import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message = "Something went wrong" }) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;