import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileQuestion,
  Play,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import { getQuizByIdApi, startQuizApi } from "../api/quizApi";

const QuizStartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startLoading, setStartLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getQuizByIdApi(id);
      setQuiz(data.quiz);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleStart = async () => {
    setStartLoading(true);
    setError("");

    try {
      const { data } = await startQuizApi(id);
      const attemptId = data.attempt?._id;

      if (!attemptId) {
        setError("Attempt could not be started");
        return;
      }

      if (data.redirectToResult) {
        navigate(`/attempts/${attemptId}/result`);
      } else {
        navigate(`/attempts/${attemptId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start quiz");
    } finally {
      setStartLoading(false);
    }
  };

  if (loading) {
    return <Loader label="Loading quiz details..." />;
  }

  if (error && !quiz) {
    return <ErrorMessage message={error} />;
  }

  const totalMarks =
    quiz?.questions?.reduce((sum, question) => sum + question.marks, 0) || 0;

  return (
    <div className="space-y-6">
      <Link
        to="/quizzes"
        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quizzes
      </Link>

      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-120px] top-[-120px] h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <ShieldCheck className="h-4 w-4" />
              Timed Backend Session
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              {quiz.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              {quiz.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <FileQuestion className="h-6 w-6 text-indigo-200" />
                <p className="mt-3 text-3xl font-black">
                  {quiz.questions.length}
                </p>
                <p className="text-sm font-semibold text-slate-300">
                  Questions
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <Clock className="h-6 w-6 text-sky-200" />
                <p className="mt-3 text-3xl font-black">
                  {quiz.durationInMinutes}m
                </p>
                <p className="text-sm font-semibold text-slate-300">
                  Duration
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <CheckCircle2 className="h-6 w-6 text-emerald-200" />
                <p className="mt-3 text-3xl font-black">{totalMarks}</p>
                <p className="text-sm font-semibold text-slate-300">
                  Total Marks
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/10">
            <h2 className="text-2xl font-black">Before you start</h2>

            <div className="mt-6 space-y-4">
              {[
                "Timer starts immediately after clicking Start Quiz.",
                "Closing the browser will not pause the timer.",
                "You can continue only before the timer expires.",
                "After expiry, saved answers will be submitted automatically.",
                "Correct answers are visible only on the result page.",
              ].map((text) => (
                <div key={text} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <p className="text-sm font-semibold leading-6 text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-5">
                <ErrorMessage message={error} />
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={startLoading}
              className="primary-btn mt-6 flex w-full items-center justify-center gap-2 disabled:opacity-70"
            >
              <Play className="h-5 w-5" />
              {startLoading ? "Starting..." : "Start Quiz Now"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuizStartPage;