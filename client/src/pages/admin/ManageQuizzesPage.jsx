import {
  Edit,
  FileQuestion,
  PlusCircle,
  Power,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteQuizApi,
  getAdminQuizzesApi,
  updateQuizStatusApi,
} from "../../api/adminApi";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";

const ManageQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  const fetchQuizzes = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getAdminQuizzesApi();
      setQuizzes(data.quizzes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesSearch =
        !query ||
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || quiz.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quizzes, search, statusFilter]);

  const handleStatusToggle = async (quiz) => {
    const nextStatus = quiz.status === "active" ? "inactive" : "active";

    setActionLoadingId(quiz._id);
    setError("");

    try {
      await updateQuizStatusApi(quiz._id, nextStatus);
      setQuizzes((prev) =>
        prev.map((item) =>
          item._id === quiz._id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update quiz status");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDelete = async (quiz) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${quiz.title}"?`
    );

    if (!confirmed) return;

    setActionLoadingId(quiz._id);
    setError("");

    try {
      await deleteQuizApi(quiz._id);
      setQuizzes((prev) => prev.filter((item) => item._id !== quiz._id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete quiz");
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) {
    return <Loader label="Loading quiz management..." />;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[40px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <FileQuestion className="h-4 w-4" />
              Quiz Management
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Manage all quizzes from one premium workspace.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Create, edit, activate, deactivate, delete unused quizzes, or
              import question banks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/import"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
            >
              <UploadCloud className="h-5 w-5" />
              Import
            </Link>

            <Link
              to="/admin/quizzes/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100"
            >
              <PlusCircle className="h-5 w-5" />
              Create Quiz
            </Link>
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="glass-card rounded-[32px] p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search quizzes..."
              className="input-field !pl-14"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-[36px] p-4 md:p-5">
        {filteredQuizzes.length === 0 ? (
          <div className="rounded-[28px] bg-white p-10 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-2xl font-black text-slate-950">
              No quizzes found
            </h3>
            <p className="mt-2 text-slate-500">
              Create a new quiz or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div className="hidden grid-cols-[1.4fr_120px_120px_150px_210px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500 xl:grid">
              <div>Quiz</div>
              <div>Questions</div>
              <div>Duration</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 xl:grid-cols-[1.4fr_120px_120px_150px_210px] xl:items-center"
                >
                  <div>
                    <p className="font-black text-slate-950">{quiz.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                      {quiz.description}
                    </p>
                    <p className="mt-2 text-xs font-bold text-slate-400">
                      Created by {quiz.createdBy?.name || "Admin"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 xl:hidden">
                      Questions
                    </p>
                    <p className="font-black text-slate-950">
                      {quiz.questions?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400 xl:hidden">
                      Duration
                    </p>
                    <p className="font-black text-slate-950">
                      {quiz.durationInMinutes}m
                    </p>
                  </div>

                  <div>
                    <span
                      className={`badge capitalize ${
                        quiz.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/quizzes/${quiz._id}/edit`}
                      className="rounded-2xl bg-indigo-50 p-3 text-indigo-700 transition hover:bg-indigo-100"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>

                    <button
                      onClick={() => handleStatusToggle(quiz)}
                      disabled={actionLoadingId === quiz._id}
                      className="rounded-2xl bg-amber-50 p-3 text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                      title="Toggle status"
                    >
                      <Power className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(quiz)}
                      disabled={actionLoadingId === quiz._id}
                      className="rounded-2xl bg-red-50 p-3 text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageQuizzesPage;