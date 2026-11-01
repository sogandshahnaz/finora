
"use client";

import { useState } from "react";
import { toast } from "sonner";

import SummaryCard from "@/components/dashboard/SummaryCard";
import TransactionTable from "@/components/dashboard/TransactionTable";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import AddTransactionForm from "@/components/dashboard/AddTransactionForm";
import EditTransactionForm from "@/components/dashboard/EditTransactionForm";
import ExportTransactionsButton from "@/components/dashboard/ExportTransactionsButton";
import TransactionDetailsModal from "@/components/dashboard/TransactionDetailsModal";

import { useLanguage } from "@/components/providers/LanguageProvider";

import { summaryCards as initialSummaryCards } from "@/data/summaryCards";
import { calculateFinance } from "@/lib/finance";
import { useTransactions } from "@/hooks/useTransactions";

import { translations } from "@/i18n/translations";

import type { SummaryCardData } from "@/types/dashboard";
import type {
  NewTransaction,
  Transaction,
} from "@/types/transaction";

export default function DashboardPage() {
  const { language } = useLanguage();

  const t = translations[language];

  const {
    transactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
  } = useTransactions();

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const finance = calculateFinance(transactions);

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

  function handleUpdateTransaction(updatedData: NewTransaction) {
    if (!editingTransaction) return;

    updateTransaction(editingTransaction.id, updatedData);
    setEditingTransaction(null);

    toast.success(t.transactionUpdated);
  }

  function handleAddTransaction(data: NewTransaction) {
    addTransaction(data);

    toast.success(t.transactionAdded);
  }

  function handleDeleteTransaction(id: string) {
    removeTransaction(id);

    setSelectedTransaction((current) =>
      current?.id === id ? null : current,
    );

    toast.success(t.transactionDeleted);
  }

  function handleViewTransaction(transaction: Transaction) {
    setSelectedTransaction(transaction);
  }

  return (
    <>
      {/* Dashboard Actions */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <ExportTransactionsButton
          transactions={transactions}
          language={language}
        />

        <AddTransactionForm
          onAdd={handleAddTransaction}
          language={language}
        />
      </div>

      {/* Summary Cards */}
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

      {/* Expense Chart */}
      <ExpenseChart
        transactions={transactions}
        language={language}
      />

      {/* Recent Transactions */}
      <TransactionTable
        transactions={transactions}
        onDelete={handleDeleteTransaction}
        onEdit={setEditingTransaction}
        onView={handleViewTransaction}
        language={language}
      />

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionForm
          key={editingTransaction.id}
          transaction={editingTransaction}
          onSave={handleUpdateTransaction}
          onCancel={() => setEditingTransaction(null)}
          language={language}
        />
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          language={language}
        />
      )}
    </>
  );
}
