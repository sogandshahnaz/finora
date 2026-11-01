
"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type ChartPeriod = "3m" | "6m";

type ExpenseChartProps = {
  transactions: Transaction[];
  language: Language;
};

type MonthlyFinance = {
  month: string;
  income: number;
  expenses: number;
};

function getMonthlyFinance(
  transactions: Transaction[],
  language: Language,
): MonthlyFinance[] {
  if (transactions.length === 0) {
    return [];
  }

  const monthlyTotals = new Map<
    string,
    { income: number; expenses: number }
  >();

  for (const transaction of transactions) {
    const month = transaction.date.slice(0, 7);

    const totals = monthlyTotals.get(month) ?? {
      income: 0,
      expenses: 0,
    };

    if (transaction.type === "income") {
      totals.income += transaction.amount;
    } else {
      totals.expenses += transaction.amount;
    }

    monthlyTotals.set(month, totals);
  }

  const latestMonth = [...monthlyTotals.keys()].sort().at(-1);

  if (!latestMonth) {
    return [];
  }

  const [year, month] = latestMonth.split("-").map(Number);

  const result: MonthlyFinance[] = [];

  const locale =
    language === "fa" ? "fa-IR-u-ca-persian" : "en-US";

  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(
      Date.UTC(year, month - 1 - offset, 1),
    );

    const monthKey = date.toISOString().slice(0, 7);

    const totals = monthlyTotals.get(monthKey) ?? {
      income: 0,
      expenses: 0,
    };

    result.push({
      month: date.toLocaleDateString(locale, {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      income: totals.income,
      expenses: totals.expenses,
    });
  }

  return result;
}

export default function ExpenseChart({
  transactions,
  language,
}: ExpenseChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>("6m");

  const t = translations[language];
  const isRTL = language === "fa";

  const locale = isRTL ? "fa-IR" : "en-US";

  const monthlyFinanceData = getMonthlyFinance(
    transactions,
    language,
  );

  const visibleData =
    period === "3m"
      ? monthlyFinanceData.slice(-3)
      : monthlyFinanceData;

  const chartPeriods: {
    label: string;
    value: ChartPeriod;
  }[] = [
    { label: t.threeMonths, value: "3m" },
    { label: t.sixMonths, value: "6m" },
  ];

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(locale, {
      maximumFractionDigits: 2,
    })}`;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-colors duration-200 sm:mt-8 sm:p-6 dark:border-slate-700 dark:bg-[#111827]"
    >
      {/* Chart Header */}
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[#111827] sm:text-lg dark:text-slate-100">
            {t.incomeVsExpenses}
          </h2>

          <p className="mt-1 text-xs text-[#64748B] sm:text-sm dark:text-slate-400">
            {t.compareMonthlyIncomeExpenses}
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex w-full rounded-xl bg-[#F1F5F9] p-1 sm:w-fit dark:bg-slate-800">
          {chartPeriods.map((item) => {
            const isActive = period === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setPeriod(item.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition sm:flex-none ${
                  isActive
                    ? "bg-white text-[#059669] shadow-sm dark:bg-slate-700 dark:text-emerald-400"
                    : "text-[#64748B] hover:text-[#111827] dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full sm:h-72">
        {visibleData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={visibleData}
              margin={{
                top: 8,
                right: 4,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--chart-grid, #E2E8F0)"
                className="dark:opacity-60"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                dy={8}
                tickMargin={4}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                tickFormatter={(value) =>
                  `$${Number(value).toLocaleString(locale, {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  })}`
                }
                width={42}
              />

              <Tooltip
                formatter={(value) => [
                  formatCurrency(Number(value)),
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--chart-grid, #E2E8F0)",
                  backgroundColor: "var(--chart-tooltip, #FFFFFF)",
                  color: "var(--chart-text, #111827)",
                  boxShadow: "0 4px 12px rgb(0 0 0 / 8%)",
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "var(--chart-text, #111827)",
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: "var(--chart-text, #111827)",
                }}
                cursor={{
                  fill: "rgba(148, 163, 184, 0.12)",
                }}
              />

              <Legend
                verticalAlign="top"
                align={isRTL ? "left" : "right"}
                iconType="circle"
                wrapperStyle={{
                  paddingBottom: "16px",
                  fontSize: "11px",
                  color: "#94A3B8",
                }}
              />

              <Bar
                dataKey="income"
                name={t.income}
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />

              <Bar
                dataKey="expenses"
                name={t.expenses}
                fill="#F97316"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#64748B] sm:text-sm dark:text-slate-400">
            {t.noChartData}
          </div>
        )}
      </div>
    </section>
  );
}
