import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import heartLogo from "@/assets/luvvu-heart.png";

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
      {
        role: "assistant",
        text: "Я рядом 💛 Это пока тёплая заглушка — настоящие ответы появятся, когда подключим AI.",
      },
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
          <div className="flex flex-1 items-end rounded-2xl border border-input bg-card px-4 py-3 transition-colors focus-within:border-ember focus-within:ring-4 focus-within:ring-ember/10">
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
              placeholder="Расскажи, что у тебя на душе…"
              className="max-h-40 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember text-ember-foreground transition-opacity disabled:opacity-30"
              aria-label="Отправить"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
        <p className="pb-3 text-center text-[11px] text-muted-foreground">
          Luvvu — поддержка, а не замена специалиста. В кризисе обратись к врачу.
        </p>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <img src={heartLogo} alt="" className="h-8 w-8 shrink-0" />}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-ember text-ember-foreground"
            : "rounded-bl-md bg-muted text-foreground"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  const prompts = [
    "Мне сегодня тревожно, помоги выдохнуть",
    "Я чувствую себя одиноко",
    "Хочу найти своих людей — с чего начать?",
    "Помоги разложить мысли по полочкам",
  ];
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 text-center">
      <img src={heartLogo} alt="Luvvu" className="mb-4 h-20 w-20" />
      <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
        Привет. Я здесь, чтобы выслушать.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground md:text-base">
        Расскажи, как ты, или начни с одной из мыслей ниже
      </p>
      <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onPick(p)}
            className="rounded-2xl border border-border bg-card px-4 py-3.5 text-left text-sm text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-ember/40 hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
