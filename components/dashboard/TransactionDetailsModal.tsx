
"use client";

import { useEffect } from "react";
import {
  X,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Tag,
  Wallet,
  Hash,
} from "lucide-react";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type TransactionDetailsModalProps = {
  transaction: Transaction;
  onClose: () => void;
  language: Language;
};

export default function TransactionDetailsModal({
  transaction,
  onClose,
  language,
}: TransactionDetailsModalProps) {
  const t = translations[language];
  const isRTL = language === "fa";
  const isIncome = transaction.type === "income";

  const categoryTranslations: Record<string, string> = {
    Food: t.food,
    "Food & Drinks": t.foodAndDrinks,
    Salary: t.salary,
    Freelance: t.freelance,
    Shopping: t.shopping,
    Transport: t.transport,
    Bills: t.bills,
    Other: t.other,
    Entertainment: t.entertainment,
    Health: t.health,
    Education: t.education,
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const formattedAmount = transaction.amount.toLocaleString(
    isRTL ? "fa-IR" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  const formattedDate = new Intl.DateTimeFormat(
    isRTL ? "fa-IR-u-ca-persian" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(new Date(`${transaction.date}T00:00:00`));

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-details-title"
        className="my-auto w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-[#111827] sm:p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="transaction-details-title"
              className="text-lg font-bold text-[#111827] dark:text-slate-100"
            >
              {t.transactionDetails}
            </h2>

            <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400">
              {t.transactionDetailsSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeForm}
            className="shrink-0 rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#111827] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Transaction Amount */}
        <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-5 text-center dark:bg-slate-800/70">
          <div
            className={`mx-auto flex size-12 items-center justify-center rounded-2xl ${
              isIncome
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                : "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft size={24} />
            ) : (
              <ArrowUpRight size={24} />
            )}
          </div>

          <p className="mt-4 text-xs font-medium text-[#64748B] dark:text-slate-400">
            {isIncome ? t.incomeType : t.expense}
          </p>

          <p
            dir="ltr"
            className={`mt-1 text-3xl font-bold ${
              isIncome
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {isIncome ? "+" : "-"}${formattedAmount}
          </p>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-4">
          {/* Transaction Title */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Wallet size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                {t.transactionTitle}
              </p>

              <p className="mt-1 break-words text-sm font-semibold text-[#111827] dark:text-slate-100">
                {transaction.title}
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Tag size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                {t.category}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111827] dark:text-slate-100">
                {categoryTranslations[transaction.category] ??
                  transaction.category}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <CalendarDays size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                {t.date}
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111827] dark:text-slate-100">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Hash size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#64748B] dark:text-slate-400">
                {t.transactionId}
              </p>

              <p
                dir="ltr"
                className="mt-1 break-all text-xs font-medium text-[#475569] dark:text-slate-300"
              >
                {transaction.id}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-xl bg-[#059669] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {t.closeForm}
        </button>
      </div>
    </div>
  );
}
