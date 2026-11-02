import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Campus Operations` : "Campus Operations";
  }, [title]);
}
