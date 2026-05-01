import { Outlet, createRootRoute, HeadContent, Scripts, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { MessageSquare, Briefcase, Plug, Settings, LogOut, Menu } from "lucide-react";
import heartLogo from "@/assets/luvvu-heart.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Страница не найдена</p>
        <Link to="/chat" className="mt-6 inline-flex rounded-md bg-ember px-4 py-2 text-sm font-medium text-ember-foreground">
          К чату
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Luvvu — тёплый AI для поддержки и своего круга" },
      { name: "description", content: "Luvvu — уютный AI-собеседник, который поддержит и поможет найти своих." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const isLogin = location.pathname === "/" || location.pathname === "/login";

  useEffect(() => {
    // gate: if not logged in, force to /
    if (!user && !isLogin) navigate({ to: "/" });
    // if logged in and on login → chat
    if (user && isLogin) navigate({ to: "/chat" });
  }, [user, isLogin, navigate]);

  if (!user || isLogin) return <Outlet />;

  return <AuthedLayout />;
}

function AuthedLayout() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-72 transform border-r border-sidebar-border bg-sidebar transition-transform md:relative md:translate-x-0`}
      >
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Меню"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 font-display font-semibold">
            <Flame className="h-4 w-4 text-ember" />
            Luvvu
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { to: "/chat", label: "Чат", icon: MessageSquare },
    { to: "/business", label: "Luvvu Business", icon: Briefcase },
    { to: "/connect", label: "Luvvu Connect", icon: Plug },
    { to: "/settings", label: "Настройки", icon: Settings },
  ] as const;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember">
          <Flame className="h-5 w-5 text-ember-foreground" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold leading-none">Luvvu</div>
          <div className="text-xs text-muted-foreground">минималистичный AI</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <it.icon className="h-4 w-4" />
            {it.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 truncate px-2 text-xs text-muted-foreground">{user?.email}</div>
        <button
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </div>
  );
}
