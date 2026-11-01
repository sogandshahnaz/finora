
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import TransactionTable from "@/components/dashboard/TransactionTable";
import AddTransactionForm from "@/components/dashboard/AddTransactionForm";
import EditTransactionForm from "@/components/dashboard/EditTransactionForm";
import ExportTransactionsButton from "@/components/dashboard/ExportTransactionsButton";
import TransactionDetailsModal from "@/components/dashboard/TransactionDetailsModal";
import RecurringTransactions from "@/components/dashboard/RecurringTransactions";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useTransactions } from "@/hooks/useTransactions";
import { useRecurringTransactions } from "@/hooks/useRecurringTransactions";

import { translations } from "@/i18n/translations";

import type {
  NewTransaction,
  Transaction,
} from "@/types/transaction";

export default function TransactionsPage() {
  const { language } = useLanguage();

  const t = translations[language];

  const {
    transactions,
    addTransaction,
    addTransactionWithId,
    removeTransaction,
    updateTransaction,
  } = useTransactions();

  const {
    recurringTransactions,
    isLoaded: recurringIsLoaded,
    addRecurringTransaction,
    updateRecurringTransaction,
    toggleRecurringTransaction,
    deleteRecurringTransaction,
    processDueTransactions,
  } = useRecurringTransactions();

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Process due recurring transactions after saved schedules load.
  useEffect(() => {
    if (!recurringIsLoaded) return;

    processDueTransactions(addTransactionWithId);
  }, [
    recurringIsLoaded,
    recurringTransactions,
    processDueTransactions,
    addTransactionWithId,
  ]);

  function handleAddTransaction(data: NewTransaction) {
    addTransaction(data);
    toast.success(t.transactionAdded);
  }

  function handleUpdateTransaction(updatedData: NewTransaction) {
    if (!editingTransaction) return;

    updateTransaction(editingTransaction.id, updatedData);
    setEditingTransaction(null);

    toast.success(t.transactionUpdated);
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

  function handleAddRecurring(
    data: Parameters<typeof addRecurringTransaction>[0],
  ) {
    addRecurringTransaction(data);
    toast.success(t.recurringAdded);
  }

  function handleUpdateRecurring(
    id: string,
    data: Parameters<typeof addRecurringTransaction>[0],
  ) {
    updateRecurringTransaction(id, data);
  }

  function handleToggleRecurring(id: string) {
    const recurring = recurringTransactions.find(
      (item) => item.id === id,
    );

    if (!recurring) return;

    toggleRecurringTransaction(id);

    toast.success(
      recurring.isActive
        ? t.recurringPausedMessage
        : t.recurringResumedMessage,
    );
  }

  function handleDeleteRecurring(id: string) {
    deleteRecurringTransaction(id);
    toast.success(t.recurringDeleted);
  }

  return (
    <>
      {/* Recurring Transactions */}
      <RecurringTransactions
        recurringTransactions={recurringTransactions}
        language={language}
        onAdd={handleAddRecurring}
        onUpdate={handleUpdateRecurring}
        onToggle={handleToggleRecurring}
        onDelete={handleDeleteRecurring}
      />

      {/* Page Actions */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <ExportTransactionsButton
          transactions={transactions}
          language={language}
        />

        <AddTransactionForm
          onAdd={handleAddTransaction}
          language={language}
        />
      </div>

      {/* Transactions Table */}
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
