
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

import SummaryCard from "@/components/dashboard/SummaryCard";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import ExpenseBreakdown from "@/components/dashboard/ExpenseBreakdown";

import { useTransactions } from "@/hooks/useTransactions";
import { calculateFinance } from "@/lib/finance";

import { summaryCards as initialSummaryCards } from "@/data/summaryCards";
import { translations } from "@/i18n/translations";

import type { SummaryCardData } from "@/types/dashboard";

import FinancialInsights from "@/components/dashboard/FinancialInsights";

import MonthlyBudget from "@/components/dashboard/MonthlyBudget";

export default function AnalyticsPage() {
  const { language } = useLanguage();

  const t = translations[language];

  const { transactions } = useTransactions();

  const finance = calculateFinance(transactions);

  // Prepare financial summary cards
  const summaryCards: SummaryCardData[] = initialSummaryCards.map(
    (card) => {
      const amount =
        card.id === "balance"
          ? finance.balance
          : card.id === "income"
            ? finance.income
            : finance.expenses;

      const title =
        card.id === "balance"
          ? t.totalBalance
          : card.id === "income"
            ? t.income
            : t.expenses;

      return {
        ...card,
        title,
        amount: `$${amount.toLocaleString(
          language === "fa" ? "fa-IR" : "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}`,
      };
    },
  );

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#111827] dark:text-slate-100">
            {t.monthlyOverview}
          </h2>

          <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
            {t.compareMonthlyIncomeExpenses}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.id}
              title={card.title}
              amount={card.amount}
              variant={card.variant}
            />
          ))}
        </div>
      </section>

      {/* Monthly Income and Expenses Chart */}
      <ExpenseChart
        transactions={transactions}
        language={language}
      />

      {/* Expense Breakdown */}
      <ExpenseBreakdown
        transactions={transactions}
        language={language}
      />

      {/* Monthly Budget */}
      <MonthlyBudget
        transactions={transactions}
        language={language}
      />

      {/* Financial Insights */}
      <FinancialInsights
        transactions={transactions}
        language={language}
      />
    </div>
  );
}
