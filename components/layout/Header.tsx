
"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";

import type { Language } from "@/i18n/translations";

type HeaderProps = {
  onMenuClick: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  translations: {
    dashboard: string;
    moneyManagementDescription: string;
    english: string;
    persian: string;
  };
};

export default function Header({
  onMenuClick,
  language,
  onLanguageChange,
  translations,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Prevent theme-related hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-4">
      {/* Page Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:bg-[#F1F5F9] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#111827] dark:text-slate-100 sm:text-2xl">
            {translations.dashboard}
          </h1>

          <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400 sm:mt-2 sm:text-sm">
            {translations.moneyManagementDescription}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Language Switcher */}
        <div
          className="flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          aria-label="Select language"
        >
          <Languages
            size={17}
            className="mx-1 text-[#64748B] dark:text-slate-400"
          />

          <button
            type="button"
            onClick={() => onLanguageChange("en")}
            aria-pressed={language === "en"}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              language === "en"
                ? "bg-emerald-600 text-white"
                : "text-[#64748B] hover:bg-[#F1F5F9] dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            EN
          </button>

          <button
            type="button"
            onClick={() => onLanguageChange("fa")}
            aria-pressed={language === "fa"}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
              language === "fa"
                ? "bg-emerald-600 text-white"
                : "text-[#64748B] hover:bg-[#F1F5F9] dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            فارسی
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          disabled={!mounted}
          aria-label={
            !mounted
              ? "Change theme"
              : isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
          }
          title={
            !mounted
              ? "Change theme"
              : isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
          }
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#475569] shadow-sm transition hover:bg-[#F1F5F9] disabled:cursor-wait dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {!mounted ? (
            <span className="h-[19px] w-[19px]" />
          ) : isDark ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>
      </div>
    </header>
  );
}
