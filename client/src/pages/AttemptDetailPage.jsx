import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ResultPage from "./ResultPage";

const AttemptDetailPage = () => {
  const { attemptId } = useParams();

  return (
    <div className="space-y-4">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <ResultPage key={attemptId} />
    </div>
  );
};

export default AttemptDetailPage;