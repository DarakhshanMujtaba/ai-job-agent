import { motion } from "framer-motion";
import { LayoutDashboard, LogOut, Sparkles, Kanban } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/applications", label: "Applications", icon: Kanban, end: false },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-void-700/80 bg-void-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-void-950 shadow-glow">
                <Sparkles size={17} strokeWidth={2.5} />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-void-50">
                Sagehire
              </span>
            </div>
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-amber-400"
                        : "text-void-300 hover:text-void-50"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={16} />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-lg bg-amber-500/10 border border-amber-500/20"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-void-300">
              {email}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/auth");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-void-500 px-3 py-1.5 text-xs font-medium text-void-200 hover:border-red-500/40 hover:text-red-400 transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
        <nav className="flex sm:hidden items-center gap-1 px-4 pb-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-void-300"
                )
              }
            >
              <item.icon size={14} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
