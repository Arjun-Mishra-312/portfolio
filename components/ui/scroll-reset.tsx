"use client";
import { useEffect } from "react";

// Ensures the viewport starts at the top (home) on reload or route show
export default function ScrollReset() {
  useEffect(() => {
    try { 
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto'; 
      window.scrollTo({ top: 0, left: 0, behavior: "auto" }); 
    } catch {}
  }, []);

  return null;
}


