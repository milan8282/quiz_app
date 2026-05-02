import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Search,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminAttemptsApi } from "../../api/adminApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

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

const AdminAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttempts = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAdminAttemptsApi();
      setAttempts(data.attempts || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load attempts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const filteredAttempts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attempts.filter((attempt) => {
      const quizTitle = attempt.quizId?.title || "";
      const userName = attempt.userId?.name || "";
      const userEmail = attempt.userId?.email || "";

      const matchesSearch =
        !query ||
        quizTitle.toLowerCase().includes(query) ||
        userName.toLowerCase().includes(query) ||
        userEmail.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || attempt.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [attempts, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: attempts.length,
      submitted: attempts.filter((item) => item.status === "submitted").length,
      expired: attempts.filter((item) => item.status === "expired").length,
      inProgress: attempts.filter((item) => item.status === "in-progress").length,
    };
  }, [attempts]);

  if (loading) {
    return <Loader label="Loading user attempts..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="relative overflow-hidden rounded-[26px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/15 sm:rounded-[32px] sm:p-7 lg:p-8">
        <div className="absolute right-[-90px] top-[-90px] h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[18%] h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative">
          <span className="badge bg-white/10 text-indigo-100">
            <UserCheck className="h-4 w-4" />
            Attempt Monitoring
          </span>

          <h1 className="app-title mt-5 max-w-3xl">
            Review every quiz attempt.
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base sm:leading-7">
            Track submitted, expired, and in-progress sessions with complete
            question-wise details.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="glass-card rounded-[22px] p-4 sm:rounded-[28px] sm:p-5">
          <BarChart3 className="h-6 w-6 text-indigo-600 sm:h-7 sm:w-7" />
          <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            {stats.total}
          </p>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">
            Total Attempts
          </p>
        </div>

        <div className="glass-card rounded-[22px] p-4 sm:rounded-[28px] sm:p-5">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 sm:h-7 sm:w-7" />
          <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            {stats.submitted}
          </p>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">
            Submitted
          </p>
        </div>

        <div className="glass-card rounded-[22px] p-4 sm:rounded-[28px] sm:p-5">
          <XCircle className="h-6 w-6 text-red-600 sm:h-7 sm:w-7" />
          <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            {stats.expired}
          </p>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">
            Expired
          </p>
        </div>

        <div className="glass-card rounded-[22px] p-4 sm:rounded-[28px] sm:p-5">
          <Clock3 className="h-6 w-6 text-amber-600 sm:h-7 sm:w-7" />
          <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            {stats.inProgress}
          </p>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">
            In Progress
          </p>
        </div>
      </section>

      <section className="glass-card rounded-[24px] p-3 sm:rounded-[28px] sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by user, email, or quiz..."
              className="input-field !pl-12"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="expired">Expired</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </section>

      <section className="glass-card rounded-[26px] p-3 sm:rounded-[32px] sm:p-5">
        {filteredAttempts.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center">
            <UserCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-xl font-black text-slate-950 sm:text-2xl">
              No attempts found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Attempts will appear here after users start quizzes.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-[26px] border border-slate-200 bg-white xl:block">
              <div className="grid grid-cols-[1.1fr_1.2fr_130px_120px_150px_110px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                <div>User</div>
                <div>Quiz</div>
                <div>Status</div>
                <div>Score</div>
                <div>Date</div>
                <div>Action</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredAttempts.map((attempt) => {
                  const canView =
                    attempt.status === "submitted" ||
                    attempt.status === "expired";

                  return (
                    <div
                      key={attempt._id}
                      className="grid grid-cols-[1.1fr_1.2fr_130px_120px_150px_110px] items-center gap-4 px-5 py-5 transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-black text-slate-950">
                          {attempt.userId?.name || "Unknown User"}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {attempt.userId?.email || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="font-black text-slate-950">
                          {attempt.quizId?.title || "Deleted Quiz"}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-500">
                          {attempt.quizId?.description || "-"}
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
                        <p className="font-black text-slate-950">
                          {attempt.score}/{attempt.totalMarks}
                        </p>
                        <p className="text-sm font-bold text-indigo-600">
                          {attempt.percentage}%
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-600">
                          {formatDate(attempt.createdAt)}
                        </p>
                      </div>

                      <div>
                        {canView ? (
                          <Link
                            to={`/admin/attempts/${attempt._id}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                          >
                            View
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <span className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-400">
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 xl:hidden">
              {filteredAttempts.map((attempt) => {
                const canView =
                  attempt.status === "submitted" ||
                  attempt.status === "expired";

                return (
                  <div
                    key={attempt._id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-950">
                          {attempt.userId?.name || "Unknown User"}
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-500">
                          {attempt.userId?.email || "-"}
                        </p>
                      </div>

                      <span
                        className={`badge shrink-0 capitalize ${
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

                    <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm font-black text-slate-950">
                        {attempt.quizId?.title || "Deleted Quiz"}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                        {attempt.quizId?.description || "-"}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Score
                        </p>
                        <p className="mt-1 font-black text-slate-950">
                          {attempt.score}/{attempt.totalMarks}
                        </p>
                        <p className="text-xs font-bold text-indigo-600">
                          {attempt.percentage}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Date
                        </p>
                        <p className="mt-1 text-xs font-bold leading-5 text-slate-700">
                          {formatDate(attempt.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {canView ? (
                        <Link
                          to={`/admin/attempts/${attempt._id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="flex w-full justify-center rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-400">
                          Live Attempt
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminAttemptsPage;