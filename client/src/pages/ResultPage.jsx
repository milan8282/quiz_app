import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  ListChecks,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAttemptResultApi } from "../api/attemptApi";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import QuestionReviewCard from "../components/quiz/QuestionReviewCard";

const ResultPage = () => {
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResult = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAttemptResultApi(attemptId);
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load result");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  if (loading) {
    return <Loader label="Calculating your result..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!result) {
    return <ErrorMessage message="Result not found" />;
  }

  const timeTaken =
    result.submittedAt && result.startedAt
      ? Math.max(
          0,
          Math.round(
            (new Date(result.submittedAt).getTime() -
              new Date(result.startedAt).getTime()) /
              1000 /
              60
          )
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/quizzes"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quizzes
        </Link>

        <Link
          to="/dashboard"
          className="secondary-btn inline-flex items-center gap-2"
        >
          <ListChecks className="h-4 w-4" />
          View Dashboard
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-90px] top-[-90px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-110px] left-[-80px] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <Trophy className="h-4 w-4" />
              Quiz Result
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
              {result.quiz.title}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {result.quiz.description}
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-500">
              Final Score
            </p>

            <div className="mt-4 flex items-end gap-3">
              <h2 className="text-6xl font-black">{result.score}</h2>
              <p className="mb-2 text-xl font-black text-slate-400">
                / {result.totalMarks}
              </p>
            </div>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500"
                style={{ width: `${result.percentage}%` }}
              />
            </div>

            <p className="mt-4 text-3xl font-black text-indigo-600">
              {result.percentage}%
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card rounded-[28px] p-5">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {result.correctCount}
          </p>
          <p className="text-sm font-bold text-slate-500">Correct Answers</p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <XCircle className="h-7 w-7 text-red-500" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {result.wrongCount}
          </p>
          <p className="text-sm font-bold text-slate-500">Wrong Answers</p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <BarChart3 className="h-7 w-7 text-indigo-500" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {result.unansweredCount}
          </p>
          <p className="text-sm font-bold text-slate-500">Unanswered</p>
        </div>

        <div className="glass-card rounded-[28px] p-5">
          <Clock className="h-7 w-7 text-sky-500" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {timeTaken}m
          </p>
          <p className="text-sm font-bold text-slate-500">Time Taken</p>
        </div>
      </section>

      <section className="glass-card rounded-[36px] p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
              Detailed Review
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Question-wise Analysis
            </h2>
          </div>

          <span className="badge bg-slate-100 text-slate-600">
            {result.questions.length} Questions
          </span>
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

export default ResultPage;