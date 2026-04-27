import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  History,
  Percent,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getUserDashboardApi } from "../api/attemptApi";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getUserDashboardApi();
      setStats(data.stats);
      setAttempts(data.attempts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const filteredAttempts = useMemo(() => {
    if (filter === "all") return attempts;
    return attempts.filter((attempt) => attempt.status === filter);
  }, [attempts, filter]);

  if (loading) {
    return <Loader label="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const statCards = [
    {
      label: "Total Attempts",
      value: stats?.totalAttempts || 0,
      icon: History,
      tone: "from-indigo-600 to-sky-500",
    },
    {
      label: "Completed",
      value: stats?.completedAttempts || 0,
      icon: CheckCircle2,
      tone: "from-emerald-500 to-teal-500",
    },
    {
      label: "In Progress",
      value: stats?.inProgressAttempts || 0,
      icon: Clock3,
      tone: "from-amber-500 to-orange-500",
    },
    {
      label: "Average Score",
      value: `${stats?.averagePercentage || 0}%`,
      icon: Percent,
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
              <Activity className="h-4 w-4" />
              Learning Dashboard
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Track every quiz attempt and review your progress.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              See your completed quizzes, active sessions, score percentage,
              and open detailed answer reviews anytime.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-black">
                  {stats?.averagePercentage || 0}%
                </p>
                <p className="text-sm font-semibold text-slate-300">
                  Average percentage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="glass-card overflow-hidden rounded-[30px] p-5"
            >
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

      <section className="glass-card rounded-[36px] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
              Attempt History
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Your Past Quizzes
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all" },
              { label: "In Progress", value: "in-progress" },
              { label: "Submitted", value: "submitted" },
              { label: "Expired", value: "expired" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                  filter === item.value
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="mt-6 rounded-[28px] bg-white p-10 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-2xl font-black text-slate-950">
              No attempts found
            </h3>
            <p className="mt-2 text-slate-500">
              Start a quiz and your records will appear here.
            </p>
            <Link to="/quizzes" className="primary-btn mt-6 inline-flex">
              Browse Quizzes
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_130px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500 lg:grid">
              <div>Quiz</div>
              <div>Date</div>
              <div>Status</div>
              <div>Score</div>
              <div>Action</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAttempts.map((attempt) => {
                const quiz = attempt.quizId;
                const isCompleted =
                  attempt.status === "submitted" ||
                  attempt.status === "expired";

                return (
                  <div
                    key={attempt._id}
                    className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 lg:grid-cols-[1.5fr_1fr_1fr_1fr_130px] lg:items-center"
                  >
                    <div>
                      <p className="font-black text-slate-950">
                        {quiz?.title || "Deleted Quiz"}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-500">
                        {quiz?.description || "No description available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400 lg:hidden">
                        Date
                      </p>
                      <p className="text-sm font-bold text-slate-600">
                        {formatDate(attempt.createdAt)}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`badge capitalize ${
                          attempt.status === "submitted"
                            ? "bg-emerald-50 text-emerald-700"
                            : attempt.status === "expired"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {attempt.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400 lg:hidden">
                        Score
                      </p>
                      <p className="font-black text-slate-950">
                        {attempt.score}/{attempt.totalMarks}
                      </p>
                      <p className="text-sm font-bold text-indigo-600">
                        {attempt.percentage}%
                      </p>
                    </div>

                    <div>
                      {isCompleted ? (
                        <Link
                          to={`/dashboard/attempts/${attempt._id}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                          View
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Link
                          to={`/attempts/${attempt._id}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;