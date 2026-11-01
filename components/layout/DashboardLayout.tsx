
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/i18n/translations";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage } = useLanguage();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();

  const isRTL = language === "fa";
  const t = translations[language];

  const pageTitle =
    pathname === "/"
      ? t.dashboard
      : pathname.startsWith("/transactions")
        ? t.transactions
        : pathname.startsWith("/analytics")
          ? t.analytics
          : pathname.startsWith("/settings")
            ? t.settings
            : t.dashboard;

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      lang={language}
      className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-200"
    >
      <Sidebar
        language={language}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <section
        className={`min-w-0 p-4 sm:p-6 md:p-8 ${
          isRTL ? "md:mr-64" : "md:ml-64"
        }`}
      >
        <div className="mb-6">
          <Header
            onMenuClick={() => setIsSidebarOpen(true)}
            language={language}
            onLanguageChange={setLanguage}
            translations={{
              ...t,
              dashboard: pageTitle,
            }}
          />
        </div>

        {children}
      </section>
    </main>
  );
}

