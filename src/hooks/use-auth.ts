import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, useStore } from "@/lib/store";

export function useAuth() {
  const user = useStore((s) => s.user);
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    setAuthed(isAuthenticated());
    const onStorage = () => setAuthed(isAuthenticated());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, isAuthed: authed };
}

export function useRequireAuth() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthed) navigate("/login", { replace: true });
  }, [isAuthed, navigate]);
  return isAuthed;
}
