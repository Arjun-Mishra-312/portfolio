"use client";
import { useEffect } from "react";

// Ensures the viewport starts at the top (home) on reload or route show
export default function ScrollReset() {
  useEffect(() => {
    try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch {}
    // Remove any hash and force scroll to top after the frame paints
    const clearHash = () => {
      try {
        if (typeof window !== "undefined") {
          const { pathname, search } = window.location;
          if (window.location.hash) {
            window.history.replaceState(null, "", pathname + search);
          }
        }
      } catch {}
    };

    // Scroll to the top synchronously and once again after layout
    try { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); } catch {}
    requestAnimationFrame(() => {
      clearHash();
      try { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); } catch {}
    });
  }, []);

  return null;
}


