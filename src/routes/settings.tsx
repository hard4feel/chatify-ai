import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTheme, type Theme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { Sun, Moon, Monitor, Trash2, LogOut, Check } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Настройки — Luvvu" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);

  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Светлая", icon: Sun },
    { value: "dark", label: "Тёмная", icon: Moon },
    { value: "system", label: "Системная", icon: Monitor },
  ];

  const clearCache = () => {
    const keep = localStorage.getItem("luvvu-user");
    const themeKeep = localStorage.getItem("luvvu-theme");
    localStorage.clear();
    if (keep) localStorage.setItem("luvvu-user", keep);
    if (themeKeep) localStorage.setItem("luvvu-theme", themeKeep);
    sessionStorage.clear();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Настройки</h1>
        <p className="mt-1 text-sm text-muted-foreground">Управляйте темой, кэшем и аккаунтом</p>

        <Section title="Тема оформления" desc="Выберите внешний вид интерфейса">
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => {
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-all ${
                    active
                      ? "border-ember bg-ember/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className={`h-5 w-5 ${active ? "text-ember" : ""}`} />
                  {t.label}
                  {active && <Check className="h-3.5 w-3.5 text-ember" />}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Данные" desc="Очистить локальные данные приложения (история, черновики)">
          <button
            onClick={clearCache}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            <Trash2 className="h-4 w-4" />
            {cleared ? "Кэш очищен" : "Очистить кэш"}
          </button>
        </Section>

        <Section title="Уведомления" desc="Получать уведомления о новых функциях">
          <ToggleRow label="Email-рассылка" defaultOn />
          <ToggleRow label="Push-уведомления" />
        </Section>

        <Section title="Аккаунт" desc="Выйти из текущей сессии">
          <button
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90"
          >
            <LogOut className="h-4 w-4" />
            Выйти из аккаунта
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      <div className="mt-4 space-y-2">{children}</div>
    </section>
  );
}

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-lg px-1 py-2">
      <span className="text-sm">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-ember" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform ${
            on ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
