"use client";

import { useState } from "react";

import {
  Search,
  ArrowUpRight,
  ChevronDown,
  ArrowDownWideNarrow,
} from "lucide-react";

import TransactionItem from "@/components/dashboard/TransactionItem";
import type { Transaction } from "@/types/transaction";
import type { Language } from "@/i18n/translations";
import { translations } from "@/i18n/translations";

type TransactionFilter = "all" | "income" | "expense";

type TransactionSort = "newest" | "oldest" | "highest" | "lowest";

type TransactionTableProps = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onView: (transaction: Transaction) => void;
  language: Language;
};

const ITEMS_PER_PAGE = 5;

export default function TransactionTable({
  transactions,
  onDelete,
  onEdit,
  onView,
  language,
}: TransactionTableProps) {
  const t = translations[language];
  const isRTL = language === "fa";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<TransactionFilter>("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] =
    useState<TransactionSort>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filters: {
    label: string;
    value: TransactionFilter;
  }[] = [
    { label: t.all, value: "all" },
    { label: t.incomeType, value: "income" },
    { label: t.expenses, value: "expense" },
  ];

  const sortOptions: {
    label: string;
    value: TransactionSort;
  }[] = [
    { label: t.newest, value: "newest" },
    { label: t.oldest, value: "oldest" },
    { label: t.highestAmount, value: "highest" },
    { label: t.lowestAmount, value: "lowest" },
  ];

  const categories = [
    ...new Set(
      transactions.map((transaction) => transaction.category),
    ),
  ];

  const categoryTranslations: Record<string, string> = {
    Food: t.food,
    Shopping: t.shopping,
    Transport: t.transport,
    Entertainment: t.entertainment,
    Health: t.health,
    Education: t.education,
    Salary: t.salary,
    Other: t.other,
  };

  function getCategoryLabel(category: string) {
    return categoryTranslations[category] ?? category;
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      transaction.title.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "all" ||
      transaction.type === activeFilter;

    const matchesCategory =
      activeCategory === "all" ||
      transaction.category === activeCategory;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => {
      switch (sortBy) {
        case "newest":
          return b.date.localeCompare(a.date);

        case "oldest":
          return a.date.localeCompare(b.date);

        case "highest":
          return b.amount - a.amount;

        case "lowest":
          return a.amount - b.amount;

        default:
          return 0;
      }
    },
  );

  const totalPages = Math.ceil(
    sortedTransactions.length / ITEMS_PER_PAGE,
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1),
  );

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  function resetPage() {
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    resetPage();
  }

  function handleFilterChange(value: TransactionFilter) {
    setActiveFilter(value);
    resetPage();
  }

  function handleCategoryChange(value: string) {
    setActiveCategory(value);
    resetPage();
  }

  function handleSortChange(value: TransactionSort) {
    setSortBy(value);
    resetPage();
  }

  function handleViewAll() {
    setSearchQuery("");
    setActiveFilter("all");
    setActiveCategory("all");
    setSortBy("newest");
    resetPage();
  }

  const selectClasses =
    "w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white py-2.5 ps-3 pe-9 text-sm text-[#475569] outline-none transition focus:border-[#059669] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-emerald-500";

  const iconClasses =
    "pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-slate-400";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-6 min-w-0 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm transition-colors duration-200 sm:mt-8 sm:p-6 dark:border-slate-700 dark:bg-[#111827]"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:mb-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[#111827] sm:text-lg dark:text-slate-100">
            {t.recentTransactions}
          </h2>

          <p className="mt-1 text-xs text-[#64748B] sm:text-sm dark:text-slate-400">
            {t.keepTrackOfTransactions}
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="flex w-fit shrink-0 items-center gap-1 text-sm font-medium text-[#059669] transition hover:text-[#047857] dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {t.viewAll}
          <ArrowUpRight
            size={16}
            className={isRTL ? "rotate-[-90deg]" : ""}
          />
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-5">
        <Search
          size={18}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-slate-500"
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            handleSearchChange(event.target.value)
          }
          placeholder={t.searchTransactions}
          aria-label={t.searchTransactions}
          className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 ps-10 pe-4 text-sm text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
        />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilterChange(filter.value)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-[#059669] text-white dark:bg-emerald-600 dark:text-white"
                    : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:ms-auto sm:w-auto sm:min-w-40">
          <select
            value={activeCategory}
            onChange={(event) =>
              handleCategoryChange(event.target.value)
            }
            aria-label={t.filterByCategory}
            className={selectClasses}
          >
            <option value="all">{t.allCategories}</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>

          <ChevronDown size={16} className={iconClasses} />
        </div>
      </div>

      {/* Sorting */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-[#475569] dark:text-slate-300">
          <ArrowDownWideNarrow size={18} />
          <label htmlFor="transaction-sort">{t.sortBy}</label>
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-40">
          <select
            id="transaction-sort"
            value={sortBy}
            onChange={(event) =>
              handleSortChange(
                event.target.value as TransactionSort,
              )
            }
            className={selectClasses}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown size={16} className={iconClasses} />
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-4 min-w-0">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
              onEdit={onEdit}
              onView={onView}
              language={language}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-[#64748B] dark:text-slate-400">
            {t.noTransactions}
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4 dark:border-slate-700">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(1, page - 1))
            }
            disabled={safeCurrentPage === 1}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#475569] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t.previous}
          </button>

          <span className="text-xs text-[#64748B] sm:text-sm dark:text-slate-400">
            {t.page} {safeCurrentPage} {t.of} {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(totalPages, page + 1),
              )
            }
            disabled={safeCurrentPage === totalPages}
            className="rounded-lg border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#475569] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t.next}
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="mt-4 text-xs leading-5 text-[#94A3B8] dark:text-slate-500">
        {t.showing}{" "}
        {sortedTransactions.length === 0 ? 0 : startIndex + 1}
        {"–"}
        {Math.min(
          startIndex + ITEMS_PER_PAGE,
          sortedTransactions.length,
        )}{" "}
        {t.of} {sortedTransactions.length}{" "}
        {t.matchingTransactions}
      </p>
    </section>
  );
}