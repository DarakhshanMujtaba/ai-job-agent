import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  FileSearch,
  Lock,
  Mail,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logoHorizontal from "@/assets/logo-horizontal-dark.png";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup";

const highlights = [
  {
    icon: Target,
    title: "Honest fit scoring",
    description:
      "Every job gets a plain-spoken 0-100 score, not a manufactured yes.",
  },
  {
    icon: FileSearch,
    title: "Tailored, not invented",
    description:
      "Cover letters reframe your real experience — nothing fabricated.",
  },
  {
    icon: ShieldCheck,
    title: "Prompt-injection aware",
    description:
      "We flag when a job post tries to manipulate the AI writing for you.",
  },
];

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(email, password);
        toast.success("Account created. Signing you in...");
        await login(email, password);
      } else {
        await login(email, password);
        toast.success("Welcome back.");
      }
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-void-950 px-14 py-12 border-r border-void-700">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(245,165,36,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(43,181,172,0.1), transparent 45%)",
          }}
        />
        <div className="relative z-10">
          <img
            src={logoHorizontal}
            alt="Sagehire"
            className="h-11 w-auto"
          />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="font-display text-4xl font-bold leading-tight text-void-50">
            Apply to jobs you're actually
            <span className="text-gradient-amber"> right for.</span>
          </h1>
          <p className="mt-4 text-void-300 leading-relaxed">
            An AI agent that scores your fit honestly, tailors your
            application from real experience, and preps you for the
            interview &mdash; no filler, no fabrication.
          </p>

          <div className="mt-10 space-y-5">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3.5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-void-800 border border-void-600 text-amber-400">
                  <h.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-void-50">
                    {h.title}
                  </p>
                  <p className="text-sm text-void-300 mt-0.5">
                    {h.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-void-400">
          Built for candidates who'd rather know the truth than waste a
          shot.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex lg:hidden items-center justify-center">
            <img
              src={logoHorizontal}
              alt="Sagehire"
              className="h-7 sm:h-8 w-auto"
            />
          </div>

          <div className="mb-7 flex rounded-xl border border-void-600 bg-void-800/60 p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className="relative flex-1 rounded-lg py-2 text-sm font-medium transition-colors"
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-mode-pill"
                    className="absolute inset-0 rounded-lg bg-void-600"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    mode === m ? "text-void-50" : "text-void-300"
                  }`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-2xl font-bold text-void-50">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-1.5 text-sm text-void-300">
                {mode === "login"
                  ? "Log in to pick up where you left off."
                  : "Takes about ten seconds. No credit card."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  icon={<Mail size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                {mode === "signup" && (
                  <Input
                    type="password"
                    label="Confirm password"
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  iconRight={<ArrowRight size={16} />}
                  className="w-full mt-2"
                >
                  {mode === "login" ? "Log in" : "Create account"}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
