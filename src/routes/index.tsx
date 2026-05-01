import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import heartLogo from "@/assets/luvvu-heart.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Войти — Luvvu" },
      { name: "description", content: "Войди в Luvvu — тёплый AI для поддержки." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim());
    navigate({ to: "/chat" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* мягкое тёплое свечение */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[520px] w-[520px] rounded-full bg-ember/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-ember/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <img src={heartLogo} alt="Luvvu" className="mb-3 h-20 w-20" />
          <h1 className="font-display text-3xl font-semibold tracking-tight">С возвращением</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Тёплое место, где тебя слышат
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ты@luvvu.ai"
              className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition-all focus:border-ember focus:ring-4 focus:ring-ember/15"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition-all focus:border-ember focus:ring-4 focus:ring-ember/15"
            />
          </div>
          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-ember text-sm font-semibold text-ember-foreground shadow-lg shadow-ember/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Здесь не нужно быть идеальным. Просто будь собой.
        </p>
      </div>
    </div>
  );
}
