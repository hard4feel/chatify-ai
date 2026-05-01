import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Войти — Luvvu" },
      { name: "description", content: "Вход в Luvvu" },
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
      {/* ambient ember glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-ember/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember ember-glow">
            <Flame className="h-7 w-7 text-ember-foreground" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Добро пожаловать</h1>
          <p className="mt-2 text-sm text-muted-foreground">Войдите, чтобы продолжить в Luvvu</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@luvvu.ai"
              className="h-11 w-full rounded-lg border border-input bg-card px-4 text-sm outline-none transition-colors focus:border-ember focus:ring-2 focus:ring-ember/20"
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
              className="h-11 w-full rounded-lg border border-input bg-card px-4 text-sm outline-none transition-colors focus:border-ember focus:ring-2 focus:ring-ember/20"
            />
          </div>
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-ember text-sm font-medium text-ember-foreground transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Войти
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Нет аккаунта? <span className="text-ember">Создайте</span> — это демо, любой ввод работает.
        </p>
      </div>
    </div>
  );
}
