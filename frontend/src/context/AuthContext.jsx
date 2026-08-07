import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";
import { getCurrentUser } from "../api/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);   // true while a login/signup request is in flight
  const [authChecked, setAuthChecked] = useState(false); // true once the initial session check finishes

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  async function login(credentials) {
    setLoading(true);
    try {
      await authApi.login(credentials);
      const me = await getCurrentUser();
      setUser(me);
      return me;
    } finally {
      setLoading(false);
    }
  }

  async function signup(details) {
    return authApi.signup(details);
  }

  async function verify(details) {
    return authApi.verify(details);
  }

  async function resendCode(email) {
    return authApi.resendVerificationCode(email);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, authChecked, login, signup, verify, resendCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}