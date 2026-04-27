import { BookOpenCheck, Search, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import QuizCard from "../components/quiz/QuizCard";
import { getQuizzesApi } from "../api/quizApi";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuizzes = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await getQuizzesApi();
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

    if (!query) return quizzes;

    return quizzes.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query)
    );
  }, [quizzes, search]);

  if (loading) {
    return <Loader label="Loading available quizzes..." />;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8">
        <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-indigo-500/30 blur-2xl" />
        <div className="absolute bottom-[-90px] left-[20%] h-64 w-64 rounded-full bg-sky-400/20 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <span className="badge bg-white/10 text-indigo-100">
              <BookOpenCheck className="h-4 w-4" />
              Quiz Library
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Choose your assessment and start focused practice.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Every quiz runs with a backend-powered session timer, so your
              progress stays consistent even if the browser is closed.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                <Trophy className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-black">{quizzes.length}</p>
                <p className="text-sm font-semibold text-slate-300">
                  Active quizzes available
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[32px] p-4 md:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search quizzes by title or description..."
            className="input-field !pl-12"
          />
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      {filteredQuizzes.length === 0 ? (
        <div className="glass-card rounded-[32px] p-10 text-center">
          <h3 className="text-2xl font-black text-slate-950">
            No quizzes found
          </h3>
          <p className="mt-2 text-slate-500">
            Try another search or ask admin to activate quizzes.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </section>
      )}
    </div>
  );
};

export default QuizListPage;