
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  CalendarClock,
  Plus,
  X,
  Pause,
  Play,
  Trash2,
  Repeat,
  Pencil,
} from "lucide-react";

import { toast } from "sonner";

import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

import type { TransactionType } from "@/types/transaction";
import type {
  RecurringTransaction,
  RecurrenceFrequency,
} from "@/types/recurring-transaction";

import type { NewRecurringTransaction } from "@/hooks/useRecurringTransactions";

type RecurringTransactionsProps = {
  recurringTransactions: RecurringTransaction[];
  language: Language;
  onAdd: (data: NewRecurringTransaction) => void;
  onUpdate: (id: string, data: NewRecurringTransaction) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const categories = [
  "Food",
  "Food & Drinks",
  "Salary",
  "Freelance",
  "Shopping",
  "Transport",
  "Bills",
  "Other",
];

function getTodayDate(): string {
  const today = new Date();

  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 10);
}

export default function RecurringTransactions({
  recurringTransactions,
  language,
  onAdd,
  onUpdate,
  onToggle,
  onDelete,
}: RecurringTransactionsProps) {
  const t = translations[language];
  const isRTL = language === "fa";

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [frequency, setFrequency] =
    useState<RecurrenceFrequency>("monthly");
  const [startDate, setStartDate] = useState("");

  const categoryTranslations: Record<string, string> = {
    Food: t.food,
    "Food & Drinks": t.foodAndDrinks,
    Salary: t.salary,
    Freelance: t.freelance,
    Shopping: t.shopping,
    Transport: t.transport,
    Bills: t.bills,
    Other: t.other,
  };

  const frequencyTranslations: Record<RecurrenceFrequency, string> = {
    daily: t.daily,
    weekly: t.weekly,
    monthly: t.monthly,
    yearly: t.yearly,
  };

  const labelClasses =
    "mb-2 block text-sm font-medium text-[#475569] dark:text-slate-300";

  const inputClasses =
    "w-full min-w-0 rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#059669] focus:ring-2 focus:ring-emerald-500/10 sm:px-4 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500";

  // Lock page scrolling while modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow =
        previousHtmlOverflow;

      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setCategory("Food");
    setAmount("");
    setType("expense");
    setFrequency("monthly");
    setStartDate("");
  }

  function handleOpen() {
    resetForm();
    setStartDate(getTodayDate());
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    resetForm();
  }

  // Fill the form with the selected recurring transaction.
  function handleEdit(item: RecurringTransaction) {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setAmount(String(item.amount));
    setType(item.type);
    setFrequency(item.frequency);
    setStartDate(item.startDate);
    setIsOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const numericAmount = Number(amount);

    if (!trimmedTitle) {
      toast.error(t.pleaseEnterTitle);
      return;
    }

    if (
      amount.trim() === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      toast.error(t.pleaseEnterValidAmount);
      return;
    }

    if (!startDate) {
      toast.error(t.pleaseSelectDate);
      return;
    }

    const data: NewRecurringTransaction = {
      title: trimmedTitle,
      category,
      amount: numericAmount,
      type,
      frequency,
      startDate,
    };

    if (editingId) {
      onUpdate(editingId, data);
      toast.success(t.recurringUpdated);
    } else {
      onAdd(data);
      toast.success(t.recurringAdded);
    }

    handleClose();
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(t.deleteRecurringConfirm);

    if (!confirmed) return;

    onDelete(id);
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-colors duration-200 sm:p-6 dark:border-slate-800 dark:bg-[#111827]"
    >
      {/* Section Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-[#059669] dark:bg-emerald-500/10 dark:text-emerald-400">
            <Repeat size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#111827] dark:text-slate-100">
              {t.recurringTransactions}
            </h2>

            <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
              {t.recurringDescription}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#047857] sm:w-auto"
        >
          <Plus size={18} />
          {t.addRecurring}
        </button>
      </div>

      {/* Recurring Transactions List */}
      {recurringTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] px-4 py-10 text-center dark:border-slate-700">
          <CalendarClock
            size={30}
            className="mb-3 text-[#94A3B8] dark:text-slate-500"
          />

          <p className="text-sm text-[#64748B] dark:text-slate-400">
            {t.noRecurringTransactions}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recurringTransactions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] p-4 transition-colors dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`mt-1 rounded-lg p-2 ${
                    item.type === "income"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  }`}
                >
                  <Repeat size={17} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[#111827] dark:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400">
                    {categoryTranslations[item.category] ??
                      item.category}
                    {" · "}
                    {frequencyTranslations[item.frequency]}
                  </p>

                  <p className="mt-2 text-xs text-[#64748B] dark:text-slate-400">
                    {t.nextOccurrence}: {item.nextRunDate}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {item.isActive
                      ? t.recurringActive
                      : t.recurringPaused}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p
                  className={`whitespace-nowrap text-sm font-bold ${
                    item.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}
                  {item.amount.toLocaleString(
                    language === "fa" ? "fa-IR" : "en-US",
                  )}
                </p>

                <div className="flex items-center gap-1">
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    aria-label={t.editRecurring}
                    title={t.editRecurring}
                    className="rounded-lg p-2 text-[#64748B] transition hover:bg-emerald-50 hover:text-[#059669] dark:text-slate-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                  >
                    <Pencil size={17} />
                  </button>

                  {/* Pause / Resume */}
                  <button
                    type="button"
                    onClick={() => onToggle(item.id)}
                    aria-label={item.isActive ? t.pause : t.resume}
                    title={item.isActive ? t.pause : t.resume}
                    className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#059669] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                  >
                    {item.isActive ? (
                      <Pause size={17} />
                    ) : (
                      <Play size={17} />
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    aria-label={t.deleteRecurring}
                    title={t.deleteRecurring}
                    className="rounded-lg p-2 text-[#64748B] transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Recurring Transaction Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/40 p-3 backdrop-blur-sm sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          <div
            dir={isRTL ? "rtl" : "ltr"}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recurring-form-title"
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-transparent bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-6 dark:border-slate-700 dark:bg-[#111827]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2
                id="recurring-form-title"
                className="text-lg font-bold text-[#111827] dark:text-slate-100 sm:text-xl"
              >
                {editingId ? t.editRecurring : t.newRecurring}
              </h2>

              <button
                type="button"
                onClick={handleClose}
                aria-label={t.closeForm}
                className="shrink-0 rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form
              noValidate
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="recurring-title"
                  className={labelClasses}
                >
                  {t.title}
                </label>

                <input
                  id="recurring-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t.exampleGroceryShopping}
                  maxLength={100}
                  className={inputClasses}
                />
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="recurring-amount"
                  className={labelClasses}
                >
                  {t.amountWithCurrency}
                </label>

                <input
                  id="recurring-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  dir="ltr"
                  className={inputClasses}
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label
                  htmlFor="recurring-type"
                  className={labelClasses}
                >
                  {t.transactionType}
                </label>

                <select
                  id="recurring-type"
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value as TransactionType)
                  }
                  className={inputClasses}
                >
                  <option value="expense">{t.expense}</option>
                  <option value="income">{t.incomeType}</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="recurring-category"
                  className={labelClasses}
                >
                  {t.category}
                </label>

                <select
                  id="recurring-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClasses}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {categoryTranslations[item] ?? item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency */}
              <div>
                <label
                  htmlFor="recurring-frequency"
                  className={labelClasses}
                >
                  {t.frequency}
                </label>

                <select
                  id="recurring-frequency"
                  value={frequency}
                  onChange={(event) =>
                    setFrequency(
                      event.target.value as RecurrenceFrequency,
                    )
                  }
                  className={inputClasses}
                >
                  <option value="daily">{t.daily}</option>
                  <option value="weekly">{t.weekly}</option>
                  <option value="monthly">{t.monthly}</option>
                  <option value="yearly">{t.yearly}</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="recurring-start-date"
                  className={labelClasses}
                >
                  {t.startDate}
                </label>

                <input
                  id="recurring-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  className={inputClasses}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#059669] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#047857] sm:w-auto"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
