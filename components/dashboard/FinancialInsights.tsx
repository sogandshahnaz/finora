
"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Wallet,
  TrendingUp,
} from "lucide-react";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type FinancialInsightsProps = {
  transactions: Transaction[];
  language: Language;
};

function formatCurrency(amount: number, language: Language) {
  return `$${amount.toLocaleString(
    language === "fa" ? "fa-IR" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

function getPreviousMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  const date = new Date(Date.UTC(year, monthNumber - 2, 1));

  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

export default function FinancialInsights({
  transactions,
  language,
}: FinancialInsightsProps) {
  const t = translations[language];

  const expenses = transactions.filter(
    (transaction) =>
      transaction.type === "expense" && transaction.amount > 0,
  );

  const totalExpenses = expenses.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  const averageExpense =
    expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Find the latest month containing a transaction.
  const latestMonth = transactions.reduce<string | null>(
    (latest, transaction) => {
      const month = transaction.date.slice(0, 7);

      if (!/^\d{4}-\d{2}$/.test(month)) return latest;

      return latest === null || month > latest ? month : latest;
    },
    null,
  );

  const previousMonth = latestMonth
    ? getPreviousMonth(latestMonth)
    : null;

  const latestMonthExpenses = latestMonth
    ? expenses
        .filter((transaction) =>
          transaction.date.startsWith(latestMonth),
        )
        .reduce((total, transaction) => total + transaction.amount, 0)
    : 0;

  const previousMonthExpenses = previousMonth
    ? expenses
        .filter((transaction) =>
          transaction.date.startsWith(previousMonth),
        )
        .reduce((total, transaction) => total + transaction.amount, 0)
    : 0;

  const expenseChange =
    previousMonthExpenses > 0
      ? ((latestMonthExpenses - previousMonthExpenses) /
          previousMonthExpenses) *
        100
      : null;

  // Find the category with the highest total expense.
  const categoryTotals = expenses.reduce<Record<string, number>>(
    (totals, transaction) => {
      const category = transaction.category.trim();

      totals[category] =
        (totals[category] ?? 0) + transaction.amount;

      return totals;
    },
    {},
  );

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const topCategoryPercentage =
    topCategory && totalExpenses > 0
      ? (topCategory[1] / totalExpenses) * 100
      : 0;

  const categoryLabels: Record<string, string> = {
    food: t.food,
    "food & drinks": t.foodAndDrinks,
    shopping: t.shopping,
    transport: t.transport,
    entertainment: t.entertainment,
    health: t.health,
    education: t.education,
    salary: t.salary,
    other: t.other,
    freelance: t.freelance,
    bills: t.bills,
  };

  const topCategoryLabel = topCategory
    ? categoryLabels[topCategory[0].trim().toLowerCase()] ??
      topCategory[0]
    : "";

  const isRTL = language === "fa";

  const cardClass =
    "rounded-2xl border border-[#E8E7EF] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900";

  const labelClass =
    "text-sm text-[#64748B] dark:text-slate-400";

  const valueClass =
    "mt-3 text-xl font-bold text-[#111827] dark:text-slate-100";

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#111827] dark:text-slate-100">
          {t.financialInsights}
        </h2>

        <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
          {t.financialInsightsDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Monthly Expense Change */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className={labelClass}>{t.monthlyExpenseChange}</p>

            <span className="rounded-xl bg-[#F1EEFF] p-2 text-[#8F82D1] dark:bg-violet-500/10">
              <TrendingUp size={19} />
            </span>
          </div>

          <p className={valueClass}>
            {expenseChange === null
              ? "—"
              : `${expenseChange > 0 ? "+" : ""}${expenseChange.toLocaleString(
                  language === "fa" ? "fa-IR" : "en-US",
                  { maximumFractionDigits: 1 },
                )}%`}
          </p>

          <p className="mt-2 text-xs text-[#94A3B8] dark:text-slate-400">
            {t.latestMonth}: {formatCurrency(latestMonthExpenses, language)}
          </p>

          {expenseChange !== null && (
            <div
              className={`mt-3 flex items-center gap-1 text-xs font-medium ${
                expenseChange > 0
                  ? "text-red-500"
                  : expenseChange < 0
                    ? "text-emerald-500"
                    : "text-[#94A3B8]"
              }`}
            >
              {expenseChange > 0 ? (
                <ArrowUpRight size={15} />
              ) : expenseChange < 0 ? (
                <ArrowDownRight size={15} />
              ) : null}

              {expenseChange > 0
                ? t.expensesIncreased
                : expenseChange < 0
                  ? t.expensesDecreased
                  : t.noExpenseChange}
            </div>
          )}

          {expenseChange === null && (
            <p className="mt-3 text-xs text-[#94A3B8] dark:text-slate-400">
              {t.notEnoughMonthlyData}
            </p>
          )}
        </div>

        {/* Average Expense */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className={labelClass}>{t.averageExpense}</p>

            <span className="rounded-xl bg-[#EAF5FF] p-2 text-[#65A6D3] dark:bg-sky-500/10">
              <Wallet size={19} />
            </span>
          </div>

          <p className={valueClass}>
            {formatCurrency(averageExpense, language)}
          </p>

          <p className="mt-2 text-xs text-[#94A3B8] dark:text-slate-400">
            {t.perTransaction}
          </p>
        </div>

        {/* Expense Transactions Count */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className={labelClass}>{t.expenseTransactions}</p>

            <span className="rounded-xl bg-[#FFF3E8] p-2 text-[#E5A66D] dark:bg-orange-500/10">
              <Receipt size={19} />
            </span>
          </div>

          <p className={valueClass}>
            {expenses.length.toLocaleString(
              language === "fa" ? "fa-IR" : "en-US",
            )}
          </p>

          <p className="mt-2 text-xs text-[#94A3B8] dark:text-slate-400">
            {t.totalExpenseTransactions}
          </p>
        </div>

        {/* Top Spending Category */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <p className={labelClass}>{t.topSpendingCategory}</p>

            <span className="rounded-xl bg-[#FFF0F0] p-2 text-[#E58D8D] dark:bg-red-500/10">
              <AlertTriangle size={19} />
            </span>
          </div>

          <p className={valueClass}>
            {topCategory ? topCategoryLabel : "—"}
          </p>

          <p className="mt-2 text-xs text-[#94A3B8] dark:text-slate-400">
            {topCategory
              ? `${topCategoryPercentage.toLocaleString(
                  language === "fa" ? "fa-IR" : "en-US",
                  { maximumFractionDigits: 1 },
                )}% ${t.ofTotalExpenses}`
              : t.noExpenseData}
          </p>

          {topCategory && topCategoryPercentage >= 40 && (
            <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
              {t.highSpendingWarning}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
