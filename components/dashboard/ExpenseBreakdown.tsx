
"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type ExpenseBreakdownProps = {
  transactions: Transaction[];
  language: Language;
};

const categoryColors: Record<string, string> = {
  food: "#A498DF",
  shopping: "#F4A6A6",
  transport: "#7DB8D8",
  entertainment: "#F2C078",
  health: "#82C9A5",
  education: "#8B9FE8",
  salary: "#82C9A5",
  other: "#A1A1AA",
  freelance: "#8B9FE8",
  bills: "#E5A66D",
  default: "#A1A1AA",
};

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function getCategoryLabel(
  category: string,
  t: (typeof translations)[Language],
) {
  const normalized = normalizeCategory(category);

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

  return categoryLabels[normalized] ?? category;
}

function formatCurrency(amount: number, language: Language) {
  return `$${amount.toLocaleString(
    language === "fa" ? "fa-IR" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

export default function ExpenseBreakdown({
  transactions,
  language,
}: ExpenseBreakdownProps) {
  const t = translations[language];

  const expenseTransactions = transactions.filter(
    (transaction) =>
      transaction.type === "expense" && transaction.amount > 0,
  );

  const categoryTotals = expenseTransactions.reduce<
    Record<string, number>
  >((totals, transaction) => {
    const key = normalizeCategory(transaction.category);

    totals[key] = (totals[key] ?? 0) + transaction.amount;

    return totals;
  }, {});

  const totalExpenses = Object.values(categoryTotals).reduce(
    (total, amount) => total + amount,
    0,
  );

  const chartData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      name: getCategoryLabel(category, t),
      amount,
      percentage:
        totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: categoryColors[category] ?? categoryColors.default,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = chartData[0];

  const isRTL = language === "fa";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="rounded-2xl border border-[#E8E7EF] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#111827] dark:text-slate-100">
          {t.expenseBreakdown}
        </h2>

        <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
          {t.spendingByCategory}
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center text-center text-sm text-[#94A3B8] dark:text-slate-400">
          {t.noExpenseData}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          {/* Donut Chart */}
          <div className="relative h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={105}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((item) => (
                    <Cell
                      key={item.category}
                      fill={item.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(Number(value ?? 0), language)
                  }
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E8E7EF",
                    backgroundColor: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-[#94A3B8] dark:text-slate-400">
                {t.totalExpenses}
              </span>

              <span className="mt-1 text-xl font-bold text-[#111827] dark:text-slate-100">
                {formatCurrency(totalExpenses, language)}
              </span>
            </div>
          </div>

          {/* Category Details */}
          <div className="space-y-5">
            {topCategory && (
              <div className="rounded-xl bg-[#F8F7FC] p-4 dark:bg-slate-800/70">
                <p className="text-xs text-[#64748B] dark:text-slate-400">
                  {t.topSpendingCategory}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-semibold text-[#111827] dark:text-slate-100">
                    {topCategory.name}
                  </span>

                  <span className="text-sm font-bold text-[#8F82D1]">
                    {formatCurrency(topCategory.amount, language)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {chartData.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />

                      <span className="truncate text-sm text-[#475569] dark:text-slate-300">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-sm">
                      <span className="font-medium text-[#111827] dark:text-slate-100">
                        {formatCurrency(item.amount, language)}
                      </span>

                      <span className="w-12 text-end text-xs text-[#94A3B8]">
                        {item.percentage.toLocaleString(
                          language === "fa" ? "fa-IR" : "en-US",
                          { maximumFractionDigits: 1 },
                        )}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#F1F0F6] dark:bg-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
