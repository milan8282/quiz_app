import { Brain, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, authLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/quizzes"}
        replace
      />
    );
  }

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await login(form);

      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      navigate(
        data.user?.role === "admin" ? "/admin/dashboard" : "/quizzes",
        { replace: true }
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="auth-bg flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />

      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden min-h-[680px] flex-col justify-between bg-slate-950/50 p-10 text-white lg:flex">
          <div>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-black">QuizNova</h1>
                <p className="text-xs font-semibold text-slate-400">
                  Premium assessment platform
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-xl">
              <span className="badge bg-indigo-400/10 text-indigo-200">
                <Sparkles className="h-4 w-4" />
                Built for focused learning
              </span>

              <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight">
                Login and continue your quiz journey.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Track progress, continue active quiz sessions, review past
                answers, and manage assessments from a clean modern dashboard.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["Timed", "Sessions"],
              ["Smart", "Results"],
              ["Admin", "Control"],
            ].map((item) => (
              <div
                key={item.join("-")}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-2xl font-black">{item[0]}</p>
                <p className="text-sm font-semibold text-slate-400">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 sm:p-10 lg:p-12">
          <div className="mx-auto flex min-h-[620px] max-w-md flex-col justify-center">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                  <Brain className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-950">
                    QuizNova
                  </h1>
                  <p className="text-sm font-semibold text-slate-500">
                    Premium quiz platform
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-indigo-500">
                Welcome back
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                Sign in to your account
              </h2>
              <p className="mt-3 text-slate-500">
                Use your registered email and password to continue.
              </p>
            </div>

            {error && (
              <div className="mt-6">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input-field pl-12"
                    type="email"
                    name="email"
                    placeholder="admin@test.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="input-field pl-12"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-semibold text-slate-500">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="font-black text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;