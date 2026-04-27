import {
  BarChart3,
  BookOpenCheck,
  Brain,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const userLinks = [
  { label: "Quizzes", to: "/quizzes", icon: BookOpenCheck },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
];

const adminLinks = [
  { label: "Admin Overview", to: "/admin/dashboard", icon: BarChart3 },
  { label: "Manage Quizzes", to: "/admin/quizzes", icon: ClipboardList },
  { label: "Create Quiz", to: "/admin/quizzes/create", icon: PlusCircle },
  { label: "Import Quiz", to: "/admin/import", icon: UploadCloud },
  { label: "Attempts", to: "/admin/attempts", icon: BookOpenCheck },
];

const SidebarLink = ({ item, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
          isActive
            ? "bg-white text-indigo-700 shadow-lg shadow-slate-900/5"
            : "text-slate-500 hover:bg-white/70 hover:text-slate-950"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </NavLink>
  );
};

const AppShell = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isAdmin ? adminLinks : userLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const Sidebar = () => (
    <aside className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/25">
          <Brain className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-950">
            QuizNova
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Smart quiz platform
          </p>
        </div>
      </div>

      <div className="mt-8 flex-1 space-y-2">
        {links.map((item) => (
          <SidebarLink
            key={item.to}
            item={item}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </div>

      <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Logged in as
        </p>
        <h3 className="mt-2 truncate font-black">{user?.name}</h3>
        <p className="truncate text-sm text-slate-400">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen p-3 lg:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] gap-5">
        <div className="glass-card hidden w-[290px] shrink-0 rounded-[32px] p-5 lg:block">
          <Sidebar />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden">
            <div className="glass-card h-full w-[310px] rounded-r-[32px] p-5">
              <div className="mb-5 flex justify-end">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-white p-3 text-slate-700 shadow"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="glass-card sticky top-3 z-30 mb-5 rounded-[28px] px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-2xl bg-white p-3 text-slate-700 shadow lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-500">
                  Premium Learning
                </p>
                <h2 className="text-xl font-black text-slate-950 md:text-2xl">
                  Welcome back, {user?.name?.split(" ")?.[0] || "User"}
                </h2>
              </div>

              <div className="hidden rounded-2xl bg-slate-950 px-4 py-3 text-right text-white md:block">
                <p className="text-xs font-bold text-slate-400">Role</p>
                <p className="text-sm font-black capitalize">{user?.role}</p>
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;