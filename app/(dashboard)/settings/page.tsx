
"use client";

import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/i18n/translations";
import {
  Globe2,
  Languages,
  Moon,
  Sun,
  Palette,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const t = translations[language];
  const isRTL = language === "fa";

  const languageOptions = [
    {
      value: "en" as const,
      label: "English",
      description: "English language",
      symbol: "EN",
    },
    {
      value: "fa" as const,
      label: "فارسی",
      description: "Persian language",
      symbol: "فا",
    },
  ];

  const themeOptions = [
    {
      value: "light",
      label: t.lightMode,
      description: isRTL ? "نمای روشن و ساده" : "Clean and bright interface",
      icon: Sun,
    },
    {
      value: "dark",
      label: t.darkMode,
      description: isRTL ? "نمای تاریک و چشم‌نواز" : "Easy on the eyes",
      icon: Moon,
    },
  ];

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto max-w-6xl space-y-6 pb-8"
    >
      {/* Settings Grid */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">

        {/* Language Settings */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <Languages size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                {t.language}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.languageDescription}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {languageOptions.map((option) => {
              const selected = language === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  aria-pressed={selected}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-start transition-all duration-200 ${
                    selected
                      ? "border-emerald-500/50 bg-emerald-500/[0.06]"
                      : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                        selected
                          ? "bg-emerald-600 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option.symbol}
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">
                        {option.label}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                      selected
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-border text-transparent"
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Appearance Settings */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Palette size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-foreground">
                {t.appearance}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.appearanceDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {themeOptions.map((option) => {
              const selected = theme === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  aria-pressed={selected}
                  className={`relative rounded-xl border p-3 text-start transition-all duration-200 sm:p-4 ${
                    selected
                      ? "border-emerald-500/50 bg-emerald-500/[0.06]"
                      : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}

                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon size={19} />
                  </div>

                  <p className="font-semibold text-foreground">
                    {option.label}
                  </p>

                  <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>

                  {/* Theme Preview */}
                  <div
                    className={`mt-3 flex h-14 items-center gap-2 rounded-lg border p-2 ${
                      option.value === "dark"
                        ? "border-slate-700 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div
                      className={`h-full w-1/4 rounded-md ${
                        option.value === "dark"
                          ? "bg-slate-700"
                          : "bg-slate-100"
                      }`}
                    />

                    <div className="flex flex-1 flex-col justify-center gap-2">
                      <div
                        className={`h-2 w-3/4 rounded-full ${
                          option.value === "dark"
                            ? "bg-slate-600"
                            : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`h-2 w-1/2 rounded-full ${
                          option.value === "dark"
                            ? "bg-slate-700"
                            : "bg-slate-100"
                        }`}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Preferences Information */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Globe2 size={17} />
        </div>

        <p className="text-xs leading-6 text-muted-foreground">
          {isRTL
            ? "تنظیمات انتخاب‌شده به‌صورت خودکار ذخیره می‌شوند."
            : "Your preferences are saved automatically."}
        </p>
      </div>
    </div>
  );
}
