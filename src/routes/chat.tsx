import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import heartLogo from "@/assets/luvvu-heart.png";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Чат — Luvvu" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; text: string };

const API_URL = "http://localhost:5000/api/chat";

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data.reply || "Не удалось получить ответ 💛";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "❌ Ошибка соединения с сервером" }]);
    } finally {
      setIsLoading(false);
    }
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">✍️ печатает...</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur">
        <form onSubmit={send} className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-4">
          <div className="flex flex-1 items-end rounded-2xl border border-input bg-card px-4 py-3">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(e);
                }
              }}
              placeholder="Расскажи, что у тебя на душе…"
              className="max-h-40 flex-1 resize-none bg-transparent text-sm outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ember text-ember-foreground disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <img src={heartLogo} alt="" className="h-8 w-8 shrink-0" />}
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? "rounded-br-md bg-ember text-ember-foreground" : "rounded-bl-md bg-muted text-foreground"}`}>
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
      <h1 className="font-display text-3xl font-semibold">Привет. Я здесь, чтобы выслушать.</h1>
      <p className="mt-3 text-sm text-muted-foreground">Расскажи, как ты, или начни с одной из мыслей ниже</p>
      <div className="mt-8 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {prompts.map((p) => (
          <button key={p} onClick={() => onPick(p)} className="rounded-2xl border border-border bg-card px-4 py-3.5 text-left text-sm">
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
