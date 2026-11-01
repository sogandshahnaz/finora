
"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type TransactionItemProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onView: (transaction: Transaction) => void;
  language: Language;
};

export default function TransactionItem({
  transaction,
  onDelete,
  onEdit,
  onView,
  language,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";
  const isRTL = language === "fa";
  const t = translations[language];

  const categoryTranslations: Record<string, string> = {
    Food: t.food,
    "Food & Drinks": t.foodAndDrinks,
    Salary: t.salary,
    Freelance: t.freelance,
    Shopping: t.shopping,
    Transport: t.transport,
    Bills: t.bills,
    Entertainment: t.entertainment,
    Health: t.health,
    Education: t.education,
    Other: t.other,
  };

  const categoryLabel =
    categoryTranslations[transaction.category] ??
    transaction.category;

  const formattedDate = new Date(
    `${transaction.date}T00:00:00`
  ).toLocaleDateString(
    isRTL ? "fa-IR-u-ca-persian" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const formattedAmount = transaction.amount.toLocaleString(
    isRTL ? "fa-IR" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-w-0 items-center justify-between gap-2 border-b border-[#E2E8F0] py-3 last:border-b-0 sm:gap-4 sm:py-4 dark:border-slate-700"
    >
      {/* Transaction information */}
      <button
        type="button"
        onClick={() => onView(transaction)}
        aria-label={`${t.transactionDetails}: ${transaction.title}`}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg text-start transition hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:gap-3"
      >
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-11 ${
            isIncome
              ? "bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-[#FFF7ED] text-[#EA580C] dark:bg-orange-950 dark:text-orange-400"
          }`}
        >
          {isIncome ? (
            <ArrowDownLeft
              size={18}
              className={`sm:size-5 ${isRTL ? "scale-x-[-1]" : ""}`}
            />
          ) : (
            <ArrowUpRight
              size={18}
              className={`sm:size-5 ${isRTL ? "scale-x-[-1]" : ""}`}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xs font-semibold text-[#111827] sm:text-sm dark:text-slate-100">
            {transaction.title}
          </h3>

          <p className="mt-1 truncate text-[10px] text-[#64748B] sm:text-xs dark:text-slate-400">
            {categoryLabel} · {formattedDate}
          </p>
        </div>
      </button>

      {/* Amount and actions */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
        <p
          dir="ltr"
          className={`whitespace-nowrap text-xs font-semibold sm:text-sm ${
            isIncome
              ? "text-[#10B981] dark:text-emerald-400"
              : "text-[#F97316] dark:text-orange-400"
          }`}
        >
          {isIncome ? "+" : "-"}$
          {formattedAmount}
        </p>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          aria-label={`${t.editTransaction}: ${transaction.title}`}
          title={t.editTransaction}
          className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-[#ECFDF5] hover:text-[#059669] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:p-2 dark:text-slate-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
        >
          <Pencil size={15} className="sm:size-[17px]" />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          aria-label={`${t.deleteTransaction}: ${transaction.title}`}
          title={t.deleteTransaction}
          className="rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-[#FFF1F2] hover:text-[#E11D48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 sm:p-2 dark:text-slate-400 dark:hover:bg-rose-950 dark:hover:text-rose-400"
        >
          <Trash2 size={15} className="sm:size-[17px]" />
        </button>
      </div>
    </div>
  );
}
