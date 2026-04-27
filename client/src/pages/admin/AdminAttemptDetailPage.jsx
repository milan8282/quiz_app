import { ArrowLeft, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdminAttemptDetailApi } from "../../api/adminApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import QuestionReviewCard from "../../components/quiz/QuestionReviewCard";

const AdminAttemptDetailPage = () => {
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [attemptUser, setAttemptUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttemptDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAdminAttemptDetailApi(attemptId);
      setResult(data.result);
      setAttemptUser(data.attemptUser);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load attempt detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttemptDetail();
  }, [attemptId]);

  if (loading) {
    return <Loader label="Loading attempt detail..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!result) {
    return <ErrorMessage message="Attempt result not found" />;
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/attempts"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to attempts
      </Link>

      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[20%] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <UserCheck className="h-4 w-4" />
              User Attempt Detail
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              {result.quiz.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Detailed admin view of user answers, correct answers, score, and
              final percentage.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
              Attempted By
            </p>
            <h2 className="mt-3 text-2xl font-black">
              {attemptUser?.name || "Unknown User"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-300">
              {attemptUser?.email || "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-bold text-slate-400">Score</p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {result.score}/{result.totalMarks}
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-bold text-slate-400">Percentage</p>
          <p className="mt-2 text-3xl font-black text-indigo-600">
            {result.percentage}%
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-bold text-slate-400">Correct</p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {result.correctCount}
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <p className="text-sm font-bold text-slate-400">Wrong</p>
          <p className="mt-2 text-3xl font-black text-red-600">
            {result.wrongCount}
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[36px] p-5 md:p-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
            Question Review
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Answer Breakdown
          </h2>
        </div>

        <div className="mt-6 space-y-5">
          {result.questions.map((question, index) => (
            <QuestionReviewCard
              key={question.questionId}
              question={question}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminAttemptDetailPage;