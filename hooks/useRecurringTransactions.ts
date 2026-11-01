
"use client";

import { useCallback, useEffect, useState } from "react";

import type { Transaction } from "@/types/transaction";
import type { RecurringTransaction } from "@/types/recurring-transaction";

const STORAGE_KEY = "finora-recurring-transactions";

export type NewRecurringTransaction = Omit<
  RecurringTransaction,
  "id" | "nextRunDate" | "isActive"
>;

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Uses UTC internally to avoid daylight-saving-time problems.
function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addMonthsSafely(date: Date, months: number): Date {
  const originalDay = date.getUTCDate();

  const result = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + months,
      1,
    ),
  );

  const lastDayOfMonth = new Date(
    Date.UTC(
      result.getUTCFullYear(),
      result.getUTCMonth() + 1,
      0,
    ),
  ).getUTCDate();

  result.setUTCDate(Math.min(originalDay, lastDayOfMonth));

  return result;
}

function getNextDate(
  dateString: string,
  frequency: RecurringTransaction["frequency"],
): string {
  const date = parseDate(dateString);

  switch (frequency) {
    case "daily":
      date.setUTCDate(date.getUTCDate() + 1);
      break;

    case "weekly":
      date.setUTCDate(date.getUTCDate() + 7);
      break;

    case "monthly":
      return formatDate(addMonthsSafely(date, 1));

    case "yearly":
      return formatDate(addMonthsSafely(date, 12));
  }

  return formatDate(date);
}

function isValidRecurringTransaction(
  item: unknown,
): item is RecurringTransaction {
  if (typeof item !== "object" || item === null) return false;

  const transaction = item as Record<string, unknown>;

  return (
    typeof transaction.id === "string" &&
    typeof transaction.title === "string" &&
    typeof transaction.category === "string" &&
    typeof transaction.amount === "number" &&
    Number.isFinite(transaction.amount) &&
    (transaction.type === "income" || transaction.type === "expense") &&
    ["daily", "weekly", "monthly", "yearly"].includes(
      transaction.frequency as string,
    ) &&
    typeof transaction.startDate === "string" &&
    typeof transaction.nextRunDate === "string" &&
    typeof transaction.isActive === "boolean"
  );
}

export function useRecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >([]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved recurring transactions.
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const parsed: unknown = JSON.parse(savedData);

        if (
          Array.isArray(parsed) &&
          parsed.every(isValidRecurringTransaction)
        ) {
          setRecurringTransactions(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load recurring transactions:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist recurring transactions.
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(recurringTransactions),
      );
    } catch (error) {
      console.error("Failed to save recurring transactions:", error);
    }
  }, [recurringTransactions, isLoaded]);

  // Create a recurring transaction.
  const addRecurringTransaction = useCallback(
    (data: NewRecurringTransaction) => {
      const newTransaction: RecurringTransaction = {
        ...data,
        id: crypto.randomUUID(),
        nextRunDate: data.startDate,
        isActive: true,
      };

      setRecurringTransactions((current) => [
        newTransaction,
        ...current,
      ]);
    },
    [],
  );

  
  // Update an existing recurring transaction.
  const updateRecurringTransaction = useCallback(
    (id: string, data: NewRecurringTransaction) => {
      setRecurringTransactions((current) =>
        current.map((transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                ...data,
                nextRunDate: data.startDate,
              }
            : transaction,
        ),
      );
    },
    [],
  );


  // Activate or deactivate a recurring transaction.
  const toggleRecurringTransaction = useCallback((id: string) => {
    setRecurringTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? { ...transaction, isActive: !transaction.isActive }
          : transaction,
      ),
    );
  }, []);

  // Delete a recurring transaction.
  const deleteRecurringTransaction = useCallback((id: string) => {
    setRecurringTransactions((current) =>
      current.filter((transaction) => transaction.id !== id),
    );
  }, []);

  // Generate all due transactions without creating duplicates.
  
  
const processDueTransactions = useCallback(
    (addTransactionWithId: (transaction: Transaction) => boolean) => {
      const today = getLocalDateString(new Date());
  
      let createdCount = 0;
      let hasUpdates = false;
  
      const updatedTransactions = recurringTransactions.map((recurring) => {
        if (!recurring.isActive || recurring.nextRunDate > today) {
          return recurring;
        }
  
        hasUpdates = true;
  
        let nextRunDate = recurring.nextRunDate;
  
        while (nextRunDate <= today) {
          const generatedTransaction: Transaction = {
            id: `recurring-${recurring.id}-${nextRunDate}`,
            title: recurring.title,
            category: recurring.category,
            amount: recurring.amount,
            type: recurring.type,
            date: nextRunDate,
          };
  
          if (addTransactionWithId(generatedTransaction)) {
            createdCount += 1;
          }
  
          nextRunDate = getNextDate(
            nextRunDate,
            recurring.frequency,
          );
        }
  
        return {
          ...recurring,
          nextRunDate,
        };
      });
  
      if (hasUpdates) {
        setRecurringTransactions(updatedTransactions);
      }
  
      return createdCount;
    },
    [recurringTransactions],
  );
  


  return {
    recurringTransactions,
    isLoaded,
    addRecurringTransaction,
    updateRecurringTransaction,
    toggleRecurringTransaction,
    deleteRecurringTransaction,
    processDueTransactions,
  };
}
