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
  { label: "Overview", to: "/admin/dashboard", icon: BarChart3 },
  { label: "Quizzes", to: "/admin/quizzes", icon: ClipboardList },
  { label: "Create", to: "/admin/quizzes/create", icon: PlusCircle },
  { label: "Import", to: "/admin/import", icon: UploadCloud },
  { label: "Attempts", to: "/admin/attempts", icon: BookOpenCheck },
];

const SidebarLink = ({ item, onClick }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-extrabold transition ${
          isActive
            ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{item.label}</span>
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

  const Sidebar = ({ isMobile = false }) => (
    <aside className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/25">
          <Brain className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black tracking-tight text-slate-950">
            QuizNova
          </h1>
          <p className="truncate text-xs font-bold text-slate-500">
            Smart quiz platform
          </p>
        </div>
      </div>

      <div className="mt-7 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {links.map((item) => (
          <SidebarLink
            key={item.to}
            item={item}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </div>

      <div
        className={`shrink-0 rounded-3xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/15 ${
          isMobile ? "mt-4 mb-2" : "mt-5"
        }`}
      >
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
          Account
        </p>
        <h3 className="mt-2 truncate text-sm font-black">{user?.name}</h3>
        <p className="truncate text-xs font-semibold text-slate-400">
          {user?.email}
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5 text-sm font-black text-white transition hover:bg-white/15"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-[1440px] gap-4 px-3 py-3 sm:px-4 lg:px-5 lg:py-5">
        <div className="glass-card fixed left-5 top-5 z-40 hidden h-[calc(100vh-40px)] w-[260px] rounded-[28px] p-4 lg:block">
          <Sidebar />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm lg:hidden">
            <div className="glass-card flex h-[100dvh] w-[86vw] max-w-[330px] flex-col rounded-r-[28px] p-4">
              <div className="mb-4 flex shrink-0 justify-end">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-white p-2.5 text-slate-700 shadow"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1">
                <Sidebar isMobile />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 lg:ml-[276px]">
          <header className="glass-card sticky top-3 z-30 mb-4 rounded-[24px] px-4 py-3 sm:px-5 lg:top-5 lg:mb-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="shrink-0 rounded-2xl bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-500 sm:text-xs">
                    Premium Learning
                  </p>
                  <h2 className="truncate text-lg font-black text-slate-950 sm:text-xl lg:text-2xl">
                    Welcome, {user?.name?.split(" ")?.[0] || "User"}
                  </h2>
                </div>
              </div>

              <div className="shrink-0 rounded-2xl bg-slate-950 px-3 py-2 text-right text-white">
                <p className="text-[10px] font-bold text-slate-400">Role</p>
                <p className="text-xs font-black capitalize sm:text-sm">
                  {user?.role}
                </p>
              </div>
            </div>
          </header>

          <div className="page-wrap pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;