import { useCallback, useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../api/announcements";

// Owns the announcements list + CRUD. Mutations throw on failure so callers can show
// the message inside their own form/dialog; the list is reloaded after each success.
export function useAnnouncements() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setStatus("loading");
    setError("");
    try {
      const data = await getAnnouncements();
      setItems(Array.isArray(data) ? data : []);
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

  const create = useCallback(
    async (dto) => {
      await createAnnouncement(dto);
      await load({ quiet: true });
    },
    [load]
  );

  const update = useCallback(
    async (id, dto) => {
      await updateAnnouncement(id, dto);
      await load({ quiet: true });
    },
    [load]
  );

  const remove = useCallback(
    async (id) => {
      await deleteAnnouncement(id);
      await load({ quiet: true });
    },
    [load]
  );

  return { items, status, error, reload: load, create, update, remove };
}
