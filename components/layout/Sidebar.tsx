
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

import {
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Settings,
  Wallet,
  X,
} from "lucide-react";

import { translations, type Language } from "@/i18n/translations";

type SidebarProps = {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
};

const navItemsConfig = [
  { id: "dashboard", href: "/", icon: LayoutDashboard },
  { id: "transactions", href: "/transactions", icon: ArrowLeftRight },
  { id: "analytics", href: "/analytics", icon: ChartNoAxesCombined },
  { id: "settings", href: "/settings", icon: Settings },
] as const;

export default function Sidebar({
  language,
  isOpen,
  onClose,
}: SidebarProps) {
  const t = translations[language];

  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  // Prevent theme-related hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const isRTL = language === "fa";

  const navItems = navItemsConfig.map((item) => ({
    ...item,
    label: t[item.id],
  }));

  // Close the mobile sidebar when Escape is pressed.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling while the mobile sidebar is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Theme styles
  const sidebarStyles = isDark
    ? {
        background: "bg-[#111827]",
        text: "text-white",
        border: "border-transparent",
        heading: "text-gray-400",
        inactive: "text-gray-300 hover:bg-[#1F2937] hover:text-white",
        close: "text-gray-400 hover:bg-[#1F2937] hover:text-white",
        info: "bg-[#1F2937]",
        infoText: "text-gray-400",
      }
    : {
        background: "bg-white",
        text: "text-slate-800",
        border: "border-slate-200",
        heading: "text-slate-400",
        inactive: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        close: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        info: "bg-slate-100",
        infoText: "text-slate-500",
      };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label={isRTL ? "بستن منو" : "Close navigation menu"}
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-black/50 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`fixed inset-y-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-e p-5 shadow-xl transition-all duration-300 md:translate-x-0 ${
          sidebarStyles.background
        } ${sidebarStyles.text} ${sidebarStyles.border} ${
          isRTL
            ? `right-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
            : `left-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
        }`}
      >
        {/* Brand */}
        <div className="mb-10 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#059669] text-white">
              <Wallet size={22} />
            </div>

            <h1 className="truncate text-xl font-bold">
              {t.appName}
            </h1>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={isRTL ? "بستن منو" : "Close sidebar"}
            aria-expanded={isOpen}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${sidebarStyles.close} md:hidden`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu heading */}
        <p
          className={`mb-4 px-3 text-xs font-semibold ${sidebarStyles.heading}`}
        >
          {t.mainMenu}
        </p>

        {/* Navigation */}
        <nav
          aria-label={isRTL ? "منوی اصلی" : "Main navigation"}
          className="flex flex-col gap-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#059669] text-white shadow-sm"
                    : sidebarStyles.inactive
                }`}
              >
                <Icon size={20} className="shrink-0" />

                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Information card */}
        <div className={`mt-auto rounded-xl p-4 ${sidebarStyles.info}`}>
          <p className="text-sm font-medium">
            {t.smartMoneyManagement}
          </p>

          <p
            className={`mt-2 text-xs leading-5 ${sidebarStyles.infoText}`}
          >
            {t.moneyManagementDescription}
          </p>
        </div>
      </aside>
    </>
  );
}
