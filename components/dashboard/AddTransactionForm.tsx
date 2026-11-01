"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

import type {
  NewTransaction,
  TransactionType,
} from "@/types/transaction";

import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type AddTransactionFormProps = {
  onAdd: (transaction: NewTransaction) => void;
  language: Language;
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

export default function AddTransactionForm({
  onAdd,
  language,
}: AddTransactionFormProps) {
  const t = translations[language];
  const isRTL = language === "fa";

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

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

  // Lock background scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow =
        previousHtmlOverflow;
    };
  }, [isOpen]);

  function handleOpen() {
    setDate(getTodayDate());
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const numericAmount = Number(amount);

    // Validate transaction title.
    if (!trimmedTitle) {
      toast.error(t.pleaseEnterTitle);
      return;
    }

    // Validate transaction amount.
    if (
      amount.trim() === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      toast.error(t.pleaseEnterValidAmount);
      return;
    }

    // Validate transaction date.
    if (!date) {
      toast.error(t.pleaseSelectDate);
      return;
    }

    // Add the new transaction.
    onAdd({
      title: trimmedTitle,
      category,
      date,
      amount: numericAmount,
      type,
    });

    // Reset form fields.
    setTitle("");
    setCategory("Food");
    setDate("");
    setAmount("");
    setType("expense");

    // Close modal.
    setIsOpen(false);
  }

  const labelClasses =
    "mb-2 block text-sm font-medium text-[#475569] dark:text-slate-300";

  const inputClasses =
    "w-full min-w-0 rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#059669] focus:ring-2 focus:ring-emerald-500/10 sm:px-4 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500";

  return (
    <div className="w-full sm:w-auto">
      {/* Open Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#047857] sm:w-auto"
      >
        <Plus size={18} />
        {t.addTransaction}
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/40 p-3 backdrop-blur-sm sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          {/* Modal Content */}
          <div
            dir={isRTL ? "rtl" : "ltr"}
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-form-title"
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-transparent bg-white p-4 shadow-xl transition-colors duration-200 sm:max-h-[calc(100dvh-2rem)] sm:p-6 dark:border-slate-700 dark:bg-[#111827]"
          >
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <h2
                id="transaction-form-title"
                className="text-lg font-bold text-[#111827] sm:text-xl dark:text-slate-100"
              >
                {t.newTransaction}
              </h2>

              <button
                type="button"
                onClick={handleClose}
                aria-label={t.closeForm}
                className="shrink-0 rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F9] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              noValidate
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="transaction-title"
                  className={labelClasses}
                >
                  {t.title}
                </label>

                <input
                  id="transaction-title"
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
                  htmlFor="transaction-amount"
                  className={labelClasses}
                >
                  {t.amountWithCurrency}
                </label>

                <input
                  id="transaction-amount"
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
                  htmlFor="transaction-type"
                  className={labelClasses}
                >
                  {t.transactionType}
                </label>

                <select
                  id="transaction-type"
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
                  htmlFor="transaction-category"
                  className={labelClasses}
                >
                  {t.category}
                </label>

                <select
                  id="transaction-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className={inputClasses}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {categoryTranslations[item] ?? item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="transaction-date"
                  className={labelClasses}
                >
                  {t.dateLabel}
                </label>

                <input
                  id="transaction-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
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
                  {t.saveTransaction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}