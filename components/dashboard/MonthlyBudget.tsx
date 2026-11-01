
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";
import { useMonthlyBudgets } from "@/hooks/useMonthlyBudgets";

type MonthlyBudgetProps = {
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

function getCategoryLabel(
  category: string,
  t: (typeof translations)[Language],
) {
  const labels: Record<string, string> = {
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

  return labels[category.trim().toLowerCase()] ?? category;
}

export default function MonthlyBudget({
  transactions,
  language,
}: MonthlyBudgetProps) {
  const t = translations[language];

  const { budgets, isLoaded, saveBudget, deleteBudget } =
    useMonthlyBudgets();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");

  const isRTL = language === "fa";

  useEffect(() => {
    const now = new Date();

    const month = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;

    setCurrentMonth(month);
  }, []);

  const monthlyExpenses = useMemo(() => {
    if (!currentMonth) return [];

    return transactions.filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.date.startsWith(currentMonth),
    );
  }, [transactions, currentMonth]);

  const spentByCategory = useMemo(() => {
    return monthlyExpenses.reduce<Record<string, number>>(
      (totals, transaction) => {
        const key = transaction.category.trim().toLowerCase();

        totals[key] = (totals[key] ?? 0) + transaction.amount;

        return totals;
      },
      {},
    );
  }, [monthlyExpenses]);

  const totalBudget = budgets.reduce(
    (total, budget) => total + budget.amount,
    0,
  );

  const totalSpent = budgets.reduce((total, budget) => {
    const categoryKey = budget.category.trim().toLowerCase();

    return total + (spentByCategory[categoryKey] ?? 0);
  }, 0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    const normalizedCategory = category.trim().toLowerCase();

    if (!category.trim()) {
      setError(t.budgetCategoryRequired);
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError(t.budgetAmountInvalid);
      return;
    }

    const duplicate = budgets.find(
      (budget) =>
        budget.category.trim().toLowerCase() === normalizedCategory &&
        budget.id !== editingId,
    );

    if (duplicate) {
      setError(t.budgetAlreadyExists);
      return;
    }

    saveBudget(category.trim(), parsedAmount);

    setCategory("");
    setAmount("");
    setEditingId(null);
    setError("");
  };

  const handleEdit = (budgetId: string) => {
    const budget = budgets.find((item) => item.id === budgetId);

    if (!budget) return;

    setCategory(budget.category);
    setAmount(String(budget.amount));
    setEditingId(budget.id);
    setError("");
  };

  const handleCancelEdit = () => {
    setCategory("");
    setAmount("");
    setEditingId(null);
    setError("");
  };

  if (!isLoaded || !currentMonth) {
    return null;
  }

  const inputClass =
    "w-full rounded-xl border border-[#E8E7EF] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#A1A1AA] focus:border-[#A498DF] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="rounded-2xl border border-[#E8E7EF] bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-xl bg-[#F1EEFF] p-2.5 text-[#8F82D1] dark:bg-violet-500/10">
          <Wallet size={21} />
        </span>

        <div>
          <h2 className="font-bold text-[#111827] dark:text-slate-100">
            {t.monthlyBudget}
          </h2>

          <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400">
            {t.monthlyBudgetDescription}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#F8F7FC] p-4 dark:bg-slate-800/70">
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            {t.totalBudget}
          </p>

          <p className="mt-2 text-lg font-bold text-[#111827] dark:text-slate-100">
            {formatCurrency(totalBudget, language)}
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F7FC] p-4 dark:bg-slate-800/70">
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            {t.totalSpent}
          </p>

          <p className="mt-2 text-lg font-bold text-[#111827] dark:text-slate-100">
            {formatCurrency(totalSpent, language)}
          </p>
        </div>

        <div className="rounded-xl bg-[#F8F7FC] p-4 dark:bg-slate-800/70">
          <p className="text-xs text-[#64748B] dark:text-slate-400">
            {t.remainingBudget}
          </p>

          <p
            className={`mt-2 text-lg font-bold ${
              totalBudget - totalSpent < 0
                ? "text-red-500"
                : "text-emerald-500"
            }`}
          >
            {formatCurrency(totalBudget - totalSpent, language)}
          </p>
        </div>
      </div>

      {/* Add / Edit Budget Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl border border-[#E8E7EF] p-4 dark:border-slate-800"
      >
        <h3 className="mb-4 text-sm font-semibold text-[#111827] dark:text-slate-100">
          {editingId ? t.editBudget : t.setBudget}
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-[#64748B] dark:text-slate-400">
              {t.category}
            </label>

            <input
              value={category}
              disabled={!!editingId}
              onChange={(event) => setCategory(event.target.value)}
              placeholder={t.budgetCategoryPlaceholder}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-[#64748B] dark:text-slate-400">
              {t.budgetAmount}
            </label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="e.g. 500"
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500">{error}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#A498DF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9183D2]"
          >
            <Plus size={16} />
            {editingId ? t.updateBudget : t.saveBudget}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl border border-[#E8E7EF] px-4 py-2.5 text-sm text-[#64748B] transition hover:bg-[#F8F7FC] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t.cancel}
            </button>
          )}
        </div>
      </form>

      {/* Budget List */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-[#111827] dark:text-slate-100">
          {t.categoryBudgets}
        </h3>

        {budgets.length === 0 ? (
          <div className="rounded-xl bg-[#F8F7FC] px-4 py-10 text-center dark:bg-slate-800/70">
            <Wallet
              size={28}
              className="mx-auto mb-3 text-[#A498DF]"
            />

            <p className="text-sm text-[#64748B] dark:text-slate-400">
              {t.noBudgets}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {budgets.map((budget) => {
              const spent =
                spentByCategory[budget.category.trim().toLowerCase()] ?? 0;

              const percentage = (spent / budget.amount) * 100;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage >= 80;

              const progressColor = isOverBudget
                ? "bg-red-500"
                : isNearLimit
                  ? "bg-amber-500"
                  : "bg-[#A498DF]";

              return (
                <div key={budget.id}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111827] dark:text-slate-100">
                        {getCategoryLabel(budget.category, t)}
                      </p>

                      <p className="mt-1 text-xs text-[#94A3B8]">
                        {formatCurrency(spent, language)} /{" "}
                        {formatCurrency(budget.amount, language)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isOverBudget
                            ? "text-red-500"
                            : isNearLimit
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }`}
                      >
                        {percentage.toLocaleString(
                          language === "fa" ? "fa-IR" : "en-US",
                          { maximumFractionDigits: 1 },
                        )}%
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEdit(budget.id)}
                        aria-label={t.editBudget}
                        className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F1EEFF] hover:text-[#8F82D1] dark:hover:bg-slate-800"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          deleteBudget(budget.id);

                          if (editingId === budget.id) {
                            handleCancelEdit();
                          }
                        }}
                        aria-label={t.deleteBudget}
                        className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-[#F1F0F6] dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    {isOverBudget ? (
                      <>
                        <AlertTriangle
                          size={14}
                          className="text-red-500"
                        />

                        <span className="text-red-500">
                          {t.overBudgetBy}{" "}
                          {formatCurrency(spent - budget.amount, language)}
                        </span>
                      </>
                    ) : isNearLimit ? (
                      <>
                        <AlertTriangle
                          size={14}
                          className="text-amber-500"
                        />

                        <span className="text-amber-500">
                          {t.budgetAlmostReached}
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500"
                        />

                        <span className="text-[#64748B] dark:text-slate-400">
                          {t.budgetRemaining}:{" "}
                          {formatCurrency(budget.amount - spent, language)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
