import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/business")({
  head: () => ({ meta: [{ title: "Luvvu Business — скоро" }] }),
  component: BusinessPage,
});

function BusinessPage() {
  return <ComingSoon icon={Briefcase} title="Luvvu Business" subtitle="Тёплая забота для команд и сообществ" />;
}

export function ComingSoon({ icon: Icon, title, subtitle }: { icon: typeof Briefcase; title: string; subtitle: string }) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-3xl" />
      <div className="relative max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-ember ember-glow">
          <Icon className="h-8 w-8 text-ember-foreground" />
        </div>
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-medium text-ember">
          <Sparkles className="h-3 w-3" />
          В разработке
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
        <p className="mt-6 text-sm text-foreground/70">
          Эта функция всё ещё придумывается. Мы работаем над тем, чтобы она была идеальной.
        </p>
        <Link
          to="/chat"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к чату
        </Link>
      </div>
    </div>
  );
}
