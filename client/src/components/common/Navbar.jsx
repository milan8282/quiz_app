import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpenCheck, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-bold transition ${
      isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to={user?.role === "admin" ? "/admin/dashboard" : "/quizzes"} className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black leading-none text-slate-900">QuizPro</p>
            <p className="text-[11px] font-bold text-slate-400">Assessment Platform</p>
          </div>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-2">
            {user.role === "admin" ? (
              <>
                <NavLink to="/admin/dashboard" className={linkClass}>Admin</NavLink>
                <NavLink to="/admin/quizzes" className={linkClass}>Quizzes</NavLink>
                <NavLink to="/admin/attempts" className={linkClass}>Attempts</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/quizzes" className={linkClass}>Quizzes</NavLink>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                {user.role === "admin" ? (
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                ) : (
                  <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                )}
                <div>
                  <p className="text-xs font-black text-slate-800">{user.name}</p>
                  <p className="text-[10px] uppercase font-black text-slate-400">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-secondary !py-2 flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link className="btn-secondary !py-2" to="/login">Login</Link>
              <Link className="btn-primary !py-2" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {user && (
        <div className="md:hidden max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {user.role === "admin" ? (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>Admin</NavLink>
              <NavLink to="/admin/quizzes" className={linkClass}>Quizzes</NavLink>
              <NavLink to="/admin/attempts" className={linkClass}>Attempts</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/quizzes" className={linkClass}>Quizzes</NavLink>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;