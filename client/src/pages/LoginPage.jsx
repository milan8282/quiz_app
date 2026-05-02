import { Brain, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, authLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
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

      navigate(
        from || (data.user?.role === "admin" ? "/admin/dashboard" : "/quizzes"),
        { replace: true }
      );
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="auth-bg flex min-h-screen items-center justify-center overflow-hidden px-3 py-5 sm:px-5">
      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl shadow-black/25 backdrop-blur-2xl lg:grid-cols-[1fr_0.9fr] lg:rounded-[36px]">
        <div className="hidden min-h-[620px] flex-col justify-between bg-slate-950/45 p-8 text-white lg:flex xl:p-10">
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

            <div className="mt-16 max-w-xl">
              <span className="badge bg-indigo-400/10 text-indigo-200">
                <Sparkles className="h-4 w-4" />
                Focused learning workspace
              </span>

              <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight xl:text-5xl">
                Continue quizzes, review scores, and track progress.
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-300">
                A polished quiz platform with timed sessions, user dashboards,
                and admin controls.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["Timed", "Sessions"],
              ["Smart", "Results"],
              ["Admin", "Control"],
            ].map((item) => (
              <div
                key={item.join("-")}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xl font-black">{item[0]}</p>
                <p className="text-xs font-semibold text-slate-400">
                  {item[1]}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto flex min-h-[560px] max-w-md flex-col justify-center">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-950">
                    QuizNova
                  </h1>
                  <p className="text-xs font-bold text-slate-500">
                    Premium quiz platform
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Sign in
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Use your account to continue your quiz journey.
            </p>

            {error && (
              <div className="mt-5">
                <ErrorMessage message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
                className="primary-btn w-full disabled:opacity-70"
              >
                {authLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm font-semibold text-slate-500">
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