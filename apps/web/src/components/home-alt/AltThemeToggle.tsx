"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const LEGACY_THEME_KEYS = ["ob-alt-theme-v2", "ob-alt-theme-v3", "ob-alt-theme-v4"];

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("ob-dark-mode", isDark);
}

function clearLegacyThemeStorage() {
  for (const key of LEGACY_THEME_KEYS) {
    window.localStorage.removeItem(key);
  }
}

export default function AltThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    applyTheme(false);
    clearLegacyThemeStorage();
    setIsDark(false);
    document.documentElement.classList.remove("ob-dark-mode");
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    applyTheme(nextIsDark);
    setIsDark(nextIsDark);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#05070B] bg-white text-[#05070B] transition-transform hover:scale-105"
    >
      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>
  );
}
