/**
 * Lightweight bilingual layer (English default, Simplified Chinese switchable).
 *
 * Design: the Chinese string stays in the source as the translation key, so
 * `t("首页")` returns "Home" in English mode and the key itself in Chinese mode.
 * Unknown keys fall back to the key, so untranslated strings still render.
 *
 * Interpolation: `t("共 {n} 项", { n: 3 })`.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DICT } from "./dict";

export type Lang = "en" | "zh";

const STORAGE_KEY = "kt-lang";
export const DEFAULT_LANG: Lang = "en";

/** Module-level mirror so non-component helpers (labelFor, formatters) can translate too. */
let currentLang: Lang = DEFAULT_LANG;

export function getLang(): Lang {
  return currentLang;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Translate a Chinese source string. Safe to call outside React. */
export function t(zh: string, vars?: Record<string, string | number>): string {
  if (currentLang === "zh") return interpolate(zh, vars);
  return interpolate(DICT[zh] ?? zh, vars);
}

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof t;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "zh" || stored === "en") {
        currentLang = stored;
        setLangState(stored);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    currentLang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    setLangState(next);
  }, []);

  // keep the module mirror correct during render (SSR + language switch)
  currentLang = lang;

  const value = useMemo<LangContextValue>(() => ({ lang, setLang, t }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (ctx) return ctx;
  return { lang: currentLang, setLang: () => undefined, t };
}

/** Convenience hook when only the translate function is needed. */
export function useT() {
  return useLang().t;
}
