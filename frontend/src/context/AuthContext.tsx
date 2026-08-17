import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/api/endpoints";
import { setAuthToken } from "@/api/client";
import { extractErrorMessage } from "@/api/client";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "sagehire_token";
const EMAIL_KEY = "sagehire_email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) setAuthToken(stored);
    return stored;
  });
  const [email, setEmail] = useState<string | null>(() =>
    sessionStorage.getItem(EMAIL_KEY)
  );

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      setAuthToken(data.access_token);
      sessionStorage.setItem(TOKEN_KEY, data.access_token);
      sessionStorage.setItem(EMAIL_KEY, email);
      setToken(data.access_token);
      setEmail(email);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      await authApi.signup(email, password);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      email,
      isAuthenticated: !!token,
      login,
      signup,
      logout,
    }),
    [token, email, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
