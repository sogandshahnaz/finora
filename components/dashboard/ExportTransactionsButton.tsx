
"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type ExportTransactionsButtonProps = {
  transactions: Transaction[];
  language: Language;
};

export default function ExportTransactionsButton({
  transactions,
  language,
}: ExportTransactionsButtonProps) {
  const t = translations[language];
  const isRTL = language === "fa";

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

  function handleExport() {
    if (transactions.length === 0) {
      toast.error(t.exportEmpty);
      return;
    }

    const headers = [
      t.transactionId,
      t.transactionTitle,
      t.category,
      t.date,
      t.amount,
      t.type,
    ];

    const rows = transactions.map((transaction) => [
      transaction.id,
      transaction.title,
      categoryTranslations[transaction.category] ??
        transaction.category,
      transaction.date,
      transaction.amount,
      transaction.type === "income" ? t.incomeType : t.expense,
    ]);

    const escapeCSV = (value: string | number) => {
      const text = String(value);
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Add UTF-8 BOM for better Excel compatibility.
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `finora-transactions-${today}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success(t.exportSuccess);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      dir={isRTL ? "rtl" : "ltr"}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#475569] shadow-sm transition hover:bg-[#F8FAFC] sm:w-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <Download size={18} />
      {isRTL ? "خروجی CSV" : "Export CSV"}
    </button>
  );
}
