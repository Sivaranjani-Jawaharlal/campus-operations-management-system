import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../api/users";

// Loads the full user directory (admin screens). `patch` lets a page apply a
// server-confirmed change locally without refetching everything.
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
  }, [load]);

  const patch = useCallback((updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
  }, []);

  return { users, status, error, reload: load, patch };
}
