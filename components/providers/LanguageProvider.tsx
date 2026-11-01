
"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { Language } from "@/i18n/translations";

const LANGUAGE_STORAGE_KEY = "finora-language";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);

  window.addEventListener("storage", callback);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Language {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return savedLanguage === "fa" ? "fa" : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  function setLanguage(newLanguage: Language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);

    listeners.forEach((listener) => listener());
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
