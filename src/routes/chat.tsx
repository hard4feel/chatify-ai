import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, Flame } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: "Чат — Luvvu" }],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; text: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: t },
      { role: "assistant", text: "Это демо-интерфейс. Подключение к AI появится позже ✨" },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <EmptyState onPick={(p) => setInput(p)} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
            {messages.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur">
        <form onSubmit={send} className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-4">
          <div className="flex flex-1 items-end rounded-2xl border border-input bg-card px-4 py-3 transition-colors focus-within:border-ember">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Сообщение Luvvu…"
              className="max-h-40 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ember text-ember-foreground transition-opacity disabled:opacity-30"
              aria-label="Отправить"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
        <p className="pb-3 text-center text-[11px] text-muted-foreground">
          Luvvu может ошибаться. Проверяйте важную информацию.
        </p>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ember">
          <Flame className="h-4 w-4 text-ember-foreground" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-ember text-ember-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  const prompts = [
    "Объясни квантовую запутанность простыми словами",
    "Напиши план поста в блог про минимализм",
    "Помоги составить расписание на неделю",
    "Идеи для подарка лучшему другу",
  ];
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ember ember-glow">
        <Sparkles className="h-6 w-6 text-ember-foreground" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        С чего начнём?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Задайте любой вопрос или выберите подсказку</p>
      <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground/80 transition-all hover:border-ember/50 hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
