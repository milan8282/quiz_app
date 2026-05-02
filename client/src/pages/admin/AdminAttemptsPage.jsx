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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[20%] h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="relative">
          <span className="badge bg-white/10 text-indigo-100">
            <UserCheck className="h-4 w-4" />
            Attempt Monitoring
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Review every quiz attempt across all users.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Track submitted, expired, and in-progress sessions with full
            question-wise result details.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card rounded-[30px] p-5">
          <BarChart3 className="h-7 w-7 text-indigo-600" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {stats.total}
          </p>
          <p className="text-sm font-bold text-slate-500">Total Attempts</p>
        </div>

        <div className="glass-card rounded-[30px] p-5">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {stats.submitted}
          </p>
          <p className="text-sm font-bold text-slate-500">Submitted</p>
        </div>

        <div className="glass-card rounded-[30px] p-5">
          <XCircle className="h-7 w-7 text-red-600" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {stats.expired}
          </p>
          <p className="text-sm font-bold text-slate-500">Expired</p>
        </div>

        <div className="glass-card rounded-[30px] p-5">
          <Clock3 className="h-7 w-7 text-amber-600" />
          <p className="mt-4 text-3xl font-black text-slate-950">
            {stats.inProgress}
          </p>
          <p className="text-sm font-bold text-slate-500">In Progress</p>
        </div>
      </section>

      <section className="glass-card rounded-[32px] p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
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

      <section className="glass-card overflow-hidden rounded-[36px] p-4 md:p-5">
        {filteredAttempts.length === 0 ? (
          <div className="rounded-[28px] bg-white p-10 text-center">
            <UserCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-2xl font-black text-slate-950">
              No attempts found
            </h3>
            <p className="mt-2 text-slate-500">
              Attempts will appear here after users start quizzes.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div className="hidden grid-cols-[1.1fr_1.2fr_130px_120px_130px_110px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500 xl:grid">
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
                    className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 xl:grid-cols-[1.1fr_1.2fr_130px_120px_130px_110px] xl:items-center"
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
        )}
      </section>
    </div>
  );
};

export default AdminAttemptsPage;