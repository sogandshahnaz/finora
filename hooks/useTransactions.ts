
"use client";

import { useCallback, useSyncExternalStore } from "react";

import { transactions as initialTransactions } from "@/data/transactions";
import type {
  NewTransaction,
  Transaction,
} from "@/types/transaction";

const STORAGE_KEY = "finora-transactions";

const serverSnapshot: Transaction[] = [...initialTransactions];

type Listener = () => void;

const listeners = new Set<Listener>();

let cachedRaw: string | null | undefined;
let cachedTransactions: Transaction[] | undefined;

function getSnapshot(): Transaction[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw && cachedTransactions !== undefined) {
    return cachedTransactions;
  }

  cachedRaw = raw;

  if (raw === null) {
    cachedTransactions = [...initialTransactions];
    return cachedTransactions;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.category === "string" &&
          typeof item.date === "string" &&
          typeof item.amount === "number" &&
          Number.isFinite(item.amount) &&
          (item.type === "income" || item.type === "expense"),
      )
    ) {
      cachedTransactions = parsed as Transaction[];
      return cachedTransactions;
    }
  } catch {
    console.error("Failed to read saved transactions.");
  }

  cachedTransactions = [...initialTransactions];
  return cachedTransactions;
}

function getServerSnapshot(): Transaction[] {
  return serverSnapshot;
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  function handleStorageChange() {
    cachedRaw = undefined;
    listeners.forEach((notify) => notify());
  }

  window.addEventListener("storage", handleStorageChange);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function saveTransactions(nextTransactions: Transaction[]) {
  const serialized = JSON.stringify(nextTransactions);

  window.localStorage.setItem(STORAGE_KEY, serialized);

  cachedRaw = serialized;
  cachedTransactions = nextTransactions;

  listeners.forEach((notify) => notify());
}

export function useTransactions() {
  const transactions = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addTransaction = useCallback((newTransaction: NewTransaction) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };

    saveTransactions([transaction, ...getSnapshot()]);
  }, []);

  // Adds a transaction with a predefined ID.
  // Returns false if that ID already exists.
  const addTransactionWithId = useCallback(
    (newTransaction: Transaction): boolean => {
      const currentTransactions = getSnapshot();

      const alreadyExists = currentTransactions.some(
        (transaction) => transaction.id === newTransaction.id,
      );

      if (alreadyExists) return false;

      saveTransactions([newTransaction, ...currentTransactions]);

      return true;
    },
    [],
  );

  const removeTransaction = useCallback((id: string) => {
    const currentTransactions = getSnapshot();

    const nextTransactions = currentTransactions.filter(
      (transaction) => transaction.id !== id,
    );

    if (nextTransactions.length !== currentTransactions.length) {
      saveTransactions(nextTransactions);
    }
  }, []);

  const updateTransaction = useCallback(
    (id: string, updatedData: NewTransaction) => {
      const currentTransactions = getSnapshot();

      const transactionExists = currentTransactions.some(
        (transaction) => transaction.id === id,
      );

      if (!transactionExists) return;

      const nextTransactions = currentTransactions.map((transaction) =>
        transaction.id === id
          ? { ...updatedData, id: transaction.id }
          : transaction,
      );

      saveTransactions(nextTransactions);
    },
    [],
  );

  return {
    transactions,
    addTransaction,
    addTransactionWithId,
    removeTransaction,
    updateTransaction,
  };
}
