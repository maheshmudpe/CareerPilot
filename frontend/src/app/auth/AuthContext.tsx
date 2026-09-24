import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

const AUTH_STORAGE_KEY = "careerpilot_auth";

interface StoredAuth {
  user: User;
  token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      return null;
    }

    try {
      return JSON.parse(storedAuth) as StoredAuth;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  const login = (user: User, token: string) => {
    const authData = {
      user,
      token,
    };

    setAuth(authData);
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(authData),
    );
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}