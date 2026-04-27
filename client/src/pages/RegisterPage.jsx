import { Brain, KeyRound, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
    const { register, authLoading, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        adminSecret: "",
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
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "role" && value === "user" ? { adminSecret: "" } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role,
            };

            if (form.role === "admin") {
                payload.adminSecret = form.adminSecret;
            }

            const data = await register(payload);

            navigate(
                data.user?.role === "admin" ? "/admin/dashboard" : "/quizzes",
                { replace: true }
            );
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed. Please try again."
            );
        }
    };

    return (
        <main className="auth-bg flex min-h-screen items-center justify-center overflow-hidden p-4">
            <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />

            <section className="relative grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
                <div className="bg-white p-6 sm:p-10 lg:p-12">
                    <div className="mx-auto flex min-h-[650px] max-w-md flex-col justify-center">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.28em] text-indigo-500">
                                Create account
                            </p>
                            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                                Start your learning workspace
                            </h2>
                            <p className="mt-3 text-slate-500">
                                Register as a user or create an admin account using the secret.
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
                                    Full name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        className="input-field !pl-12"
                                        type="text"
                                        name="name"
                                        placeholder="Milan Developer"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        className="input-field !pl-12"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
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
                                        className="input-field !pl-12"
                                        type="password"
                                        name="password"
                                        placeholder="Minimum 6 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Account type
                                </label>
                                <select
                                    className="input-field"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {form.role === "admin" && (
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Admin secret
                                    </label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <input
                                            className="input-field pl-12"
                                            type="password"
                                            name="adminSecret"
                                            placeholder="admin123"
                                            value={form.adminSecret}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="primary-btn w-full disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {authLoading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-black text-indigo-600 hover:text-indigo-700"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="hidden min-h-[700px] flex-col justify-between bg-slate-950/50 p-10 text-white lg:flex">
                    <div>
                        <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400">
                                <Brain className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="font-black">QuizNova</h1>
                                <p className="text-xs font-semibold text-slate-400">
                                    Realtime quiz experience
                                </p>
                            </div>
                        </div>

                        <div className="mt-20 max-w-xl">
                            <span className="badge bg-sky-400/10 text-sky-200">
                                <Sparkles className="h-4 w-4" />
                                Premium UI + timed sessions
                            </span>

                            <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight">
                                Build quizzes, attempt tests, review every answer.
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-slate-300">
                                Admins manage quizzes and imports. Users attempt timed quizzes,
                                continue active sessions, and review past scores.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                            Product Modules
                        </p>
                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {["Role Auth", "CSV Import", "Timed Quiz", "Result Review"].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black"
                                    >
                                        {item}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default RegisterPage;