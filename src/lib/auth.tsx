import { createContext, useContext, useEffect, useState } from "react";

type User = { email: string };
type AuthCtx = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "luvvu-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = (email: string) => {
    const u = { email };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be in AuthProvider");
  return c;
}
