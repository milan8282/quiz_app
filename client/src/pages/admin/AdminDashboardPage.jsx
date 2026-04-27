import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Clock3,
  FileQuestion,
  PlusCircle,
  UploadCloud,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminAttemptsApi, getAdminQuizzesApi } from "../../api/adminApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const AdminDashboardPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [quizRes, attemptRes] = await Promise.all([
        getAdminQuizzesApi(),
        getAdminAttemptsApi(),
      ]);

      setQuizzes(quizRes.data.quizzes || []);
      setAttempts(attemptRes.data.attempts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = useMemo(() => {
    const activeQuizzes = quizzes.filter((quiz) => quiz.status === "active").length;
    const completedAttempts = attempts.filter(
      (attempt) => attempt.status === "submitted" || attempt.status === "expired"
    );

    const averagePercentage =
      completedAttempts.length > 0
        ? Number(
            (
              completedAttempts.reduce(
                (sum, attempt) => sum + attempt.percentage,
                0
              ) / completedAttempts.length
            ).toFixed(2)
          )
        : 0;

    const uniqueUsers = new Set(
      attempts.map((attempt) => attempt.userId?._id).filter(Boolean)
    ).size;

    return {
      totalQuizzes: quizzes.length,
      activeQuizzes,
      totalAttempts: attempts.length,
      uniqueUsers,
      averagePercentage,
    };
  }, [quizzes, attempts]);

  if (loading) {
    return <Loader label="Loading admin dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const statCards = [
    {
      label: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: FileQuestion,
      tone: "from-indigo-600 to-sky-500",
    },
    {
      label: "Active Quizzes",
      value: stats.activeQuizzes,
      icon: BookOpenCheck,
      tone: "from-emerald-500 to-teal-500",
    },
    {
      label: "Total Attempts",
      value: stats.totalAttempts,
      icon: Activity,
      tone: "from-amber-500 to-orange-500",
    },
    {
      label: "Users Attempted",
      value: stats.uniqueUsers,
      icon: Users,
      tone: "from-fuchsia-500 to-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[20%] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <BarChart3 className="h-4 w-4" />
              Admin Control Center
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Manage quizzes, monitor attempts, and import question banks.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              A clean workspace for quiz creation, CSV/JSON importing, active
              status control, and performance tracking.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
              Average Result
            </p>
            <p className="mt-3 text-5xl font-black">
              {stats.averagePercentage}%
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-300">
              Based on completed attempts
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="glass-card rounded-[30px] p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-lg shadow-slate-900/10`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <p className="mt-5 text-3xl font-black text-slate-950">
                {card.value}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {card.label}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Link
          to="/admin/quizzes/create"
          className="group rounded-[32px] bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <PlusCircle className="h-9 w-9 text-indigo-600" />
          <h3 className="mt-5 text-2xl font-black text-slate-950">
            Create Quiz
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Build quizzes manually with questions, options, correct answers,
            marks, and duration.
          </p>
        </Link>

        <Link
          to="/admin/import"
          className="group rounded-[32px] bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10"
        >
          <UploadCloud className="h-9 w-9 text-sky-600" />
          <h3 className="mt-5 text-2xl font-black text-slate-950">
            Import Questions
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Upload CSV or JSON files to create complete quizzes quickly.
          </p>
        </Link>

        <Link
          to="/admin/attempts"
          className="group rounded-[32px] bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
          <Clock3 className="h-9 w-9 text-emerald-600" />
          <h3 className="mt-5 text-2xl font-black text-slate-950">
            Review Attempts
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            View every submitted or expired quiz result with user details.
          </p>
        </Link>
      </section>
    </div>
  );
};

export default AdminDashboardPage;